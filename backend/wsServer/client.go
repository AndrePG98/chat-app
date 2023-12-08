package main

import (
	"log"
	"slices"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID     string
	Server *WsServer
	Conn   *websocket.Conn
	Guilds []string
	Send   chan Message
}

func NewClient(id string, server *WsServer, conn *websocket.Conn) *Client {
	return &Client{
		ID:     id,
		Server: server,
		Conn:   conn,
		Guilds: make([]string, 0),
		Send:   make(chan Message),
	}
}

func (client *Client) run() {
	defer func() {
		client.Server.Disconnect <- client.ID
	}()

	go client.read()
	client.write()
}

func (client *Client) read() {
	for {
		var newMessage Message
		err := client.Conn.ReadJSON(&newMessage)
		if err != nil {
			log.Println(err)
			return
		}
		switch newMessage.Type {
		case 0:
			client.handleRegistration(newMessage)
		case 1:
			client.handleLogin(newMessage)
		case 2:
			//handle logout
			log.Println("Logout")
		case 3:
			client.handleChatMessage(newMessage)
		}
	}
}

func (client *Client) write() {
	for messageToSend := range client.Send {
		client.Conn.WriteJSON(messageToSend)
	}
}

func (client *Client) isMemberOfGuild(guildId string) bool {
	return slices.Contains(client.Guilds, guildId)
}
