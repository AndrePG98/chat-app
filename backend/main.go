// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Server struct {
	clients map[*websocket.Conn]bool
}

func NewServer() *Server {
	return &Server{
		clients: make(map[*websocket.Conn]bool),
	}
}

var server = NewServer()

func ServeWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error after Upgrade :", err.Error())
		return
	}

	fmt.Printf("Estabilished Connection with: %s\n", conn.RemoteAddr())

	server.clients[conn] = true

	for {
		msgType, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error Reading:", err.Error())
			return
		}
		fmt.Printf("%s sended : %s\n", conn.RemoteAddr(), string(msg))

		//fmt.Println("Broadcasting message!")
		fmt.Println("Number of clients:", len(server.clients))
		for clientAddr := range server.clients {
			if err := clientAddr.WriteMessage(msgType, msg); err != nil {
				log.Println("Error broadcasting:", err)
				return
			}
		}
	}
}

func main() {

	http.HandleFunc("/ws", ServeWS)

	fmt.Println("Server running on :", 8080)

	http.ListenAndServe(":8080", nil)

}
