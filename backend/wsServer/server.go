package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type WsServer struct {
	AuthClients   map[string]*Client
	UnAuthClients map[*Client]bool
	Authenticate  chan *AuthRequest
	Connect       chan *websocket.Conn
	Disconnect    chan string
	Remove        chan *Client
}

func NewWsServer() *WsServer {
	return &WsServer{
		AuthClients:   make(map[string]*Client),
		UnAuthClients: make(map[*Client]bool),
		Authenticate:  make(chan *AuthRequest),
		Connect:       make(chan *websocket.Conn),
		Disconnect:    make(chan string),
		Remove:        make(chan *Client),
	}
}

func (server *WsServer) run() {
	addRoutes(server)
	go server.listenForNewConnections()
	go server.listenForAuthReq()
	go server.RemoveNonAuthClients()
	go server.listenForDisconnections()
	log.Println("Websocket Server listenning on", 8443)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func (server *WsServer) listenForNewConnections() {
	for newConnection := range server.Connect {
		client := NewClient(newConnection, server)
		server.UnAuthClients[client] = true
		go client.run()
	}
}

func (server *WsServer) listenForAuthReq() {
	for authReq := range server.Authenticate {
		result := authReq.Result
		client := authReq.Client
		if result {
			log.Println("New webscoket connection request from:", client.Conn.RemoteAddr())
			server.AuthClients[client.ID] = client
			delete(server.UnAuthClients, client)
			// Send initial State
			client.Send <- &Message{
				Type: 0,
				Body: AuthenticationResult{
					Result:   result,
					Token:    "Token",
					ID:       client.ID,
					UserName: client.Username,
					State:    client.Guilds,
				},
			}
		}
	}
}

func (server *WsServer) listenForDisconnections() {
	for userId := range server.Disconnect {
		server.AuthClients[userId].Conn.Close()
		delete(server.AuthClients, userId)
	}
}

func (server *WsServer) RemoveNonAuthClients() {
	for user := range server.Remove {
		user.Conn.Close()
		delete(server.UnAuthClients, user)
	}
}

func addRoutes(server *WsServer) {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		server.ServeWS(w, r)
	})
}
