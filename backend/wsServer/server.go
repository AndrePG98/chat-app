package wsServer

import (
	"backend/models"
	"context"
	"log"
	"net/http"

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

func (server *WsServer) Run() {
	//go server.PubSub(context.Background())
	for newConnection := range server.Connect {
		log.Println("Top of connect loop")
		log.Println("New Connection :", newConnection.Conn.RemoteAddr().String())
		server.Clients[newConnection.ID] = newConnection
		log.Println("Number of connections:", len(server.Clients))
		go func(client *Client) {
			client.Read()
		}(newConnection)
		log.Println("Middle of go func")
		go func(client *Client) {
			client.SendMessage()
		}(newConnection)
	}
	log.Println("Server finished running")
}

func (server *WsServer) PubSub(ctx context.Context) {
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
	log.Println("Connected to Redis:", pong)

	sub := rdb.Subscribe(ctx)

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
	log.Println("Ending ServeWs")
	return nil
}
