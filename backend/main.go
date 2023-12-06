package main

import (
	ws "backend/wsServer"
	"log"
	"net/http"
)

func setUpRoutes(server *ws.WsServer) {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		server.ServeWS(w, r)
	})
}

func main() {

	server := ws.NewWsServer()

	go server.Run()

	setUpRoutes(server)

	log.Println("Server listenning on: 8080")

	http.ListenAndServe(":8080", nil)
}
