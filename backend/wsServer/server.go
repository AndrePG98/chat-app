package main

import (
	"log"
	"net/http"

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
	go server.Database.Connect()
	defer server.Database.Disconnect()
	go server.listenForNewConnections()
	go server.listenForRemoves()
	go server.listenForAuthReq()
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
		email := authReq.Email
		logo := authReq.Logo
		state := authReq.State
		token := authReq.Token
		error := authReq.Error
		if result {
			server.AuthClients[client.ID] = client
			client.Send <- &models.IMessage{
				Type: 0,
				Body: models.AcessResult{
					Result:   result,
					Token:    token,
					UserId:   client.ID,
					Username: client.Username,
					Email:    email,
					Logo:     logo,
					State:    state,
				},
			}
			log.Println("New Client connection from:", client.Conn.RemoteAddr())
		} else {
			client.Send <- &models.IMessage{
				Type: 0,
				Body: models.AcessResult{
					Result: result,
					Error:  error,
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
