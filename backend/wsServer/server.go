package main

import (
	"log"
	"net/http"
)

type WsServer struct {
	AuthClients   map[string]*Client
	UnAuthClients map[string]*Client
	Authorize     chan *Message
	Connect       chan *Client
	Disconnect    chan string
}

func NewWsServer() *WsServer {
	return &WsServer{
		AuthClients:   make(map[string]*Client),
		UnAuthClients: make(map[string]*Client),
		Authorize:     make(chan *Message),
		Connect:       make(chan *Client),
		Disconnect:    make(chan string),
	}
}

func (server *WsServer) run() {
	addRoutes(server)
	go server.listenForDisconnections()
	go server.listenForNewConnections()
	go server.AuthorizeClients()
	log.Println("Websocket Server listenning on", 8080)
	http.ListenAndServe(":8080", nil)
}

func (server *WsServer) listenForNewConnections() {
	for newConnection := range server.Connect {
		log.Println("New webscoket connection request from:", newConnection.Conn.RemoteAddr())
		server.UnAuthClients[newConnection.ID] = newConnection
		go newConnection.run()
	}
}

func (server *WsServer) AuthorizeClients() {
	for message := range server.Authorize {
		mtype := message.Type
		body, _ := message.Body.(Registration)
		client := server.UnAuthClients[body.UserId]
		server.AuthClients[body.UserId] = client
		// send user initial State
		client.Send <- Message{Type: mtype, Body: Registration{
			UserId: body.UserId,
			Result: body.Result,
		}}
		delete(server.UnAuthClients, body.UserId)
	}
}

func (server *WsServer) listenForDisconnections() {
	for userId := range server.Disconnect {
		server.AuthClients[userId].Conn.Close()
		delete(server.AuthClients, userId)
	}
}

func addRoutes(server *WsServer) {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		server.ServeWS(w, r)
	})
}
