package wsServer

import (
	"backend/models"
	"context"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
)

type WsServer struct {
	ServerID string
	Clients  map[string]*Client
	Connect  chan *Client
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func NewWsServer() *WsServer {
	return &WsServer{
		ServerID: "1",
		Clients:  make(map[string]*Client),
		Connect:  make(chan *Client),
	}
}

func (wsServer *WsServer) Run(wg *sync.WaitGroup) {
	defer wg.Done()
	go wsServer.PubSub(context.Background())
	go wsServer.RunClients()
	wsServer.setUpRoutes()
	log.Println("Websocket Server listenning on", 8080)
	http.ListenAndServe(":8080", nil)
}

func (wsServer *WsServer) setUpRoutes() {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		wsServer.ServeWS(w, r)
	})
}

func (server *WsServer) RunClients() {
	for newConnection := range server.Connect {
		log.Println("WS Server -> New Connection :", newConnection.Conn.RemoteAddr().String())
		server.Clients[newConnection.ID] = newConnection
		go func(client *Client) {
			client.Read()
		}(newConnection)
		go func(client *Client) {
			client.SendMessage()
		}(newConnection)
	}
}

func (wsServer *WsServer) PubSub(ctx context.Context) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	pong, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Println("Error connecting to Redis:", err)
		return
	}
	log.Println("Websocket connected to Redis:", pong)

	sub := rdb.Subscribe(ctx, "httpServer")

	defer sub.Close()

	ch := sub.Channel()

	for msg := range ch {
		log.Println(msg.Channel, msg.Payload)
	}
}

func (server *WsServer) ServeWS(w http.ResponseWriter, r *http.Request) error {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return err
	}
	userID := r.URL.Query().Get("id")

	server.Connect <- NewClient(userID, server, ws)

	ws.WriteJSON(models.Message{
		Type: 0,
	})
	return nil
}
