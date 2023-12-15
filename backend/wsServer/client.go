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
		Guilds:        make([]string, 0),
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

func (client *Client) write() {
	for messageToSend := range client.Send {
		client.Conn.WriteJSON(*messageToSend)
	}
}

func (client *Client) read() {
	for {
		var newMessage models.IMessage
		err := client.Conn.ReadJSON(&newMessage)
		if err != nil {
			log.Println(err)
			return
		}
		client.handleMessage(newMessage)
	}
}

func (client *Client) authenticate(id string, username string) {
	client.ID = id
	client.Username = username
	client.Authenticated = true
}

func (client *Client) handleMessage(msg models.IMessage) {
	switch msg.Type {
	case models.E_Register:
		var body models.RegisterEvent
		mapstructure.Decode(msg.Body, &body)
		handleRegistration(client, body)
	case models.E_Login:
		var body models.LoginEvent
		mapstructure.Decode(msg.Body, &body)
		handleLogin(client, body)
	case models.E_Logout:
		handleLogout(client)
	case models.E_CreateGuild:
		var body models.CreateGuildEvent
		mapstructure.Decode(msg.Body, &body)
		handleCreateGuild(client, body)
	case models.B_ChatMessage:
		var body models.SendMessageEvent
		mapstructure.Decode(msg.Body, &body)
		handleChatMessage(client, body)
	case models.E_CreateChannel:
		var body models.CreateChannelEvent
		mapstructure.Decode(msg.Body, &body)
		handleCreateChannel(client, body)
	}
}

func (client *Client) joinGuilds(guilds []models.Guild) {
	for _, guild := range guilds {
		client.Guilds = append(client.Guilds, guild.ID)
	}
}

func (client *Client) joinGuild(guildId string) {
	client.Guilds = append(client.Guilds, guildId)
}

func (client *Client) isMemberOfGuild(guildId string) bool {
	return slices.Contains(client.Guilds, guildId)
}

func (client *Client) isAuthenticated() bool {
	return client.Authenticated
}
