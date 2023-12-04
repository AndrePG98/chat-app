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
		log.Println("Error after Upgrade :", err)
		log.Println("Error with:", conn.RemoteAddr())
		log.Println("Clients after Error :", len(server.clients))
		return
	}

	fmt.Printf("Estabilished Connection with: %s\n", conn.RemoteAddr())

	server.clients[conn] = true

	log.Println("Clients after new Connection:", len(server.clients))

	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error after Reading :", err)
			log.Println("Error with:", conn.RemoteAddr())
			delete(server.clients, conn)
			log.Println("Clients after Error :", len(server.clients))
			return
		}

		err = conn.WriteMessage(messageType, []byte("Messaged received"))
		if err != nil {
			log.Println("Error after Sending :", err)
			log.Println("Error with:", conn.RemoteAddr())
			delete(server.clients, conn)
			log.Println("Clients after Error :", len(server.clients))
		}

		log.Println(string(message))

		/* if len(message) != 0 {
			for c := range server.clients {
				err := c.WriteMessage(messageType, message)
				if err != nil {
					log.Println("Error in Broadcasting to :", c.RemoteAddr())
					delete(server.clients, c)
					log.Println("Clients :", len(server.clients))
					return
				}
			}
		} */

		/* if err := conn.WriteMessage(messageType, message); err != nil {
			log.Println("Error after Writing :", err)
			delete(server.clients, conn)
			return
		} */
	}
}

func main() {

	http.HandleFunc("/ws", ServeWS)

	fmt.Println("Server running on :", 8080)

	http.ListenAndServe(":8080", nil)

}
