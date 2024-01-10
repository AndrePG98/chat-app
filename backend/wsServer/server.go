package main

import (
	"log"
	"net/http"
	"time"

	"wsServer/models"

	"github.com/gorilla/websocket"
)

type WsServer struct {
	AuthClients   map[string]*Client
	UnAuthClients map[*Client]bool
	Authenticate  chan *AuthRequest
	Connect       chan *websocket.Conn
	Disconnect    chan string
	Remove        chan *Client
	Database      *Database
}

func NewWsServer() *WsServer {
	return &WsServer{
		AuthClients:   make(map[string]*Client),
		UnAuthClients: make(map[*Client]bool),
		Authenticate:  make(chan *AuthRequest),
		Connect:       make(chan *websocket.Conn),
		Disconnect:    make(chan string),
		Remove:        make(chan *Client),
		Database:      NewDatabase(),
	}
}

func (server *WsServer) run() {
	addRoutes(server)
	server.Database.ConnectWithRetry(20, time.Second*1)
	defer server.Database.Disconnect()
	go server.listenForNewConnections()
	go server.listenForRemoves()
	go server.listenForAuthReq()
	go server.listenForDisconnections()
	log.Println("Websocket Server listenning on", 8080)
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
		client := authReq.Client
		if authReq.Result {
			server.AuthClients[client.ID] = client
			client.Send <- &models.IMessage{
				Type: 0,
				Body: models.AcessResult{
					Result:   authReq.Result,
					Token:    authReq.Token,
					UserId:   client.ID,
					Username: client.Username,
					Email:    authReq.Email,
					Logo:     authReq.Logo,
					IsMuted:  authReq.IsMuted,
					IsDeafen: authReq.IsDeafen,
					State:    authReq.State,
					Invites:  authReq.Invites,
				},
			}
			log.Println("New Client connection from:", client.Conn.RemoteAddr())
		} else {
			client.Send <- &models.IMessage{
				Type: 0,
				Body: models.AcessResult{
					Result: authReq.Result,
					Error:  authReq.Error,
				},
			}
		}
		delete(server.UnAuthClients, client)
	}
}

func (server *WsServer) listenForDisconnections() {
	for userId := range server.Disconnect {
		delete(server.AuthClients, userId)
	}
}

func (server *WsServer) listenForRemoves() {
	for client := range server.Remove {
		delete(server.UnAuthClients, client)
	}
}

func addRoutes(server *WsServer) {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		server.ServeWS(w, r)
	})
}
