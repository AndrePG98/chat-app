package websocket

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Server struct {
	Register   chan *Client
	UnRegister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan *Data
}

func NewServer() *Server {
	return &Server{
		Register:   make(chan *Client),
		UnRegister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan *Data),
	}
}

func (server *Server) Run() {
	for {
		select {
		case client := <-server.Register:
			log.Println("Client Connected:", client.Conn.RemoteAddr())
			server.Clients[client] = true
			log.Println("Number of clientes after connection:", len(server.Clients))
			/* for client := range server.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: "New user connected"})
			} */
		case client := <-server.UnRegister:
			delete(server.Clients, client)
			log.Println("Client Disconnected:", client.Conn.RemoteAddr())
			log.Println("Number of clientes after disconnect:", len(server.Clients))
			/* for client := range server.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: "User Disconnected"})
			} */
		case message := <-server.Broadcast:
			for client := range server.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					log.Println(err)
					return
				}
			}
		}
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (server *Server) ServeWS(w http.ResponseWriter, r *http.Request) error {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return err
	}

	client := &Client{Conn: ws, Server: server}

	go func() {
		server.Register <- client
	}()

	go client.Listen()

	return nil
}
