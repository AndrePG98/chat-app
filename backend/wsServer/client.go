package main

import (
	"log"
	"slices"

	"wsServer/models"

	"github.com/gorilla/websocket"
	"github.com/mitchellh/mapstructure"
)

type Client struct {
	ID            string
	Username      string
	Authenticated bool
	Server        *WsServer
	Conn          *websocket.Conn
	Guilds        []string
	Send          chan *models.IMessage
}

func NewClient(conn *websocket.Conn, server *WsServer) *Client {
	client := &Client{
		Authenticated: false,
		Server:        server,
		Conn:          conn,
		Send:          make(chan *models.IMessage),
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
		var newMessage models.IMessage
		err := client.Conn.ReadJSON(&newMessage)
		if err != nil {
			log.Println(err)
			return
		}

		switch newMessage.Type {
		case 0:
			var body models.RegisterEvent
			mapstructure.Decode(newMessage.Body, &body)
			handleRegistration(client, body)
		case 1:
			var body models.LoginEvent
			mapstructure.Decode(newMessage.Body, &body)
			handleLogin(client, body)
		case 2:
			//handle logout
			log.Println("Logout")
		case 3:
			var body models.SendMessageEvent
			mapstructure.Decode(newMessage.Body, &body)
			handleChatMessage(client, body)
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
