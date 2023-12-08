package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

func (server *WsServer) ServeWS(w http.ResponseWriter, r *http.Request) {

	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatalln(err)
	}
	userID := r.URL.Query().Get("id")

	server.Connect <- NewClient(userID, server, ws)

}
