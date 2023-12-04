package models

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Guild struct {
	ServerID    string
	Members     map[*Client]bool
	Subscribe   chan *Client
	Unsubscribe chan *Client
	Broadcast   chan *Data
}

func NewServer() *Guild {
	return &Guild{
		Subscribe:   make(chan *Client),
		Unsubscribe: make(chan *Client),
		Members:     make(map[*Client]bool),
		Broadcast:   make(chan *Data),
	}
}

func (guild *Guild) Run() {
	for {
		select {
		case member := <-guild.Subscribe:
			log.Println("Client Connected:", member.Conn.RemoteAddr())
			guild.Members[member] = true
			log.Println("Number of clientes after connection:", len(guild.Members))
			/* for client := range server.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: "New user connected"})
			} */
		case client := <-guild.Unsubscribe:
			delete(guild.Members, client)
			log.Println("Client Disconnected:", client.Conn.RemoteAddr())
			log.Println("Number of clientes after disconnect:", len(guild.Members))
			/* for client := range server.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: "User Disconnected"})
			} */
		case message := <-guild.Broadcast:
			for client := range guild.Members {
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

func (guild *Guild) ServeWS(w http.ResponseWriter, r *http.Request) error {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return err
	}

	client := &Client{Conn: ws, Server: guild}

	go func() {
		guild.Subscribe <- client
	}()

	go client.Read()

	return nil
}
