package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func (server *HttpServer) Connect(w http.ResponseWriter, req *http.Request) {
	userID := req.URL.Query().Get("id")

	// fetch database information
	// message ws of the logged in
	// send back user information

	connectResponse := Message{
		Type: 0,
		Body: InitialConnect{
			UserId:   userID,
			GuildIds: []string{"1"},
		},
	}
	jsonResponse, err := json.Marshal(connectResponse)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)
	}

	log.Println("New connection from:", req.RemoteAddr)
}

func (server *HttpServer) SendMessage(w http.ResponseWriter, req *http.Request) {
	var chatMessage ChatMessage
	err := json.NewDecoder(req.Body).Decode(&chatMessage)
	if err != nil {
		log.Println(err)
	}
	server.redisClient.sendMessage(chatMessage.Message)
}
