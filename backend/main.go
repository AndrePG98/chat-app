package main

import (
	"log"
	"net/http"

	"ws/websocket"
)

func setUpRoutes(server *websocket.Server) {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		server.ServeWS(w, r)
	})
}

func main() {

	server := websocket.NewServer()

	go server.Run()

	setUpRoutes(server)

	log.Println("Server listenning on: 8080")

	http.ListenAndServe(":8080", nil)
}
