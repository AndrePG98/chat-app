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
	Guilds        map[string][]string
	Authenticate  chan *AuthRequest
	Connect       chan *websocket.Conn
	Disconnect    chan string
	Remove        chan *Client
	Update        chan *models.UpdateGuilds
	Database      *Database
}

func NewWsServer() *WsServer {
	return &WsServer{
		AuthClients:   make(map[string]*Client),
		UnAuthClients: make(map[*Client]bool),
		Guilds:        map[string][]string{},
		Authenticate:  make(chan *AuthRequest),
		Connect:       make(chan *websocket.Conn),
		Disconnect:    make(chan string),
		Remove:        make(chan *Client),
		Update:        make(chan *models.UpdateGuilds),
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
	go server.listenGuildUpdates()
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
		state := authReq.State
		token := authReq.Token
		error := authReq.Error
		if result {
			server.AuthClients[client.ID] = client
			for _, guild := range state {
				client.Server.Update <- &models.UpdateGuilds{
					Type:    models.R_GuildJoin,
					GuildId: guild.ID,
					UserId:  client.ID,
				}
			}
			// Send initial State
			client.Send <- &models.IMessage{
				Type: 0,
				Body: models.AcessResult{
					Result:   result,
					Token:    token,
					UserId:   client.ID,
					Username: client.Username,
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

func (server *WsServer) listenGuildUpdates() {
	for req := range server.Update {
		switch req.Type {
		case models.R_GuildJoin:
			if users, exist := server.Guilds[req.GuildId]; exist {
				server.Guilds[req.GuildId] = append(users, req.UserId)
			} else {
				server.Guilds[req.GuildId] = []string{req.UserId}
			}
		case models.R_GuildLeave:
			for i, userId := range server.Guilds[req.GuildId] {
				if userId == req.UserId {
					server.Guilds[req.GuildId] = remove(server.Guilds[req.GuildId], i)
					break
				}
			}
		case models.B_GuildDelete:
			delete(server.Guilds, req.GuildId)
		}
	}
}

func addRoutes(server *WsServer) {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		server.ServeWS(w, r)
	})
}
