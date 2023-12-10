package main

import (
	"log"
	"slices"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID            string
	Username      string
	Authenticated bool
	Server        *WsServer
	Conn          *websocket.Conn
	Guilds        []string
	Send          chan *Message
}

func NewClient(conn *websocket.Conn, server *WsServer) *Client {
	client := &Client{
		Authenticated: false,
		Server:        server,
		Conn:          conn,
		Send:          make(chan *Message),
	}
	return client
}

func (client *Client) run() {
	defer func() {
		if client.Authenticated {
			client.Server.Disconnect <- client.ID
		} else {
			client.Server.Remove <- client
		}
	}()
	go client.write()
	client.read()

}

func (client *Client) authenticate(id string, username string, guilds []string) {
	client.ID = id
	client.Username = username
	client.Guilds = append(client.Guilds, guilds...)
	client.Authenticated = true
}

func (client *Client) JoinGuilds(guildIds []string) {
	client.Guilds = append(client.Guilds, guildIds...)
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
			handleRegistration(client, newMessage)
		case 1:
			handleLogin(client, newMessage)
		case 2:
			//handle logout
			log.Println("Logout")
		case 3:
			handleChatMessage(client, newMessage)
		}
	}

}

func (client *Client) write() {
	for messageToSend := range client.Send {
		client.Conn.WriteJSON(*messageToSend)
	}
}

func (client *Client) isMemberOfGuild(guildId string) bool {
	return slices.Contains(client.Guilds, guildId)
}

func (client *Client) isAuthenticated() bool {
	return client.Authenticated
}
