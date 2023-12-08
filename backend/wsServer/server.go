package main

import (
	"log"
	"net/http"
)

type WsServer struct {
	redisClient *RedisClient
	Clients     map[string]*Client
	Connect     chan *Client
	Disconnect  chan string
}

func NewWsServer() *WsServer {
	return &WsServer{
		redisClient: NewRedisClient(),
		Clients:     make(map[string]*Client),
		Connect:     make(chan *Client),
	}
}

func (server *WsServer) run() {
	addRoutes(server)
	go server.redisClient.listen()
	go server.listenForDisconnections()
	go server.listenForNewConnections()
	log.Println("Websocket Server listenning on", 8080)
	http.ListenAndServe(":8080", nil)
}

func (server *WsServer) listenForNewConnections() {
	for newConnection := range server.Connect {
		log.Println("New Webscoket connection from:", newConnection.Conn.RemoteAddr())
		server.Clients[newConnection.ID] = newConnection
		go newConnection.run()
	}
}

func (server *WsServer) listenForDisconnections() {
	for userId := range server.Disconnect {
		server.Clients[userId].Conn.Close()
		delete(server.Clients, userId)
	}
}

func addRoutes(server *WsServer) {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		server.ServeWS(w, r)
	})
}
