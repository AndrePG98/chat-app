package main

import (
	"log"

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
		broadcastLogout(client)

	case models.E_CreateGuild:
		var body models.CreateGuildEvent
		mapstructure.Decode(msg.Body, &body)
		handleCreateGuild(client, body)

	case models.E_DeleteGuild:
		var body models.DeleteGuildEvent
		mapstructure.Decode(msg.Body, &body)
		broadcastGuildDelete(client, body)

	case models.E_JoinGuild:
		var body models.JoinGuildEvent
		mapstructure.Decode(msg.Body, &body)
		handleJoinGuild(client, body)

	case models.E_LeaveGuild:
		var body models.LeaveGuildEvent
		mapstructure.Decode(msg.Body, &body)
		handleLeaveGuild(client, body)

	case models.E_CreateChannel:
		var body models.CreateChannelEvent
		mapstructure.Decode(msg.Body, &body)
		broadcastChannelCreate(client, body)

	case models.E_DeleteChannel:
		var body models.DeleteChannelEvent
		mapstructure.Decode(msg.Body, &body)
		broadcastChannelDelete(client, body)

	case models.E_JoinChannel:
		var body models.JoinChannelEvent
		mapstructure.Decode(msg.Body, &body)
		broadcastChannelJoin(client, body)

	case models.E_JoinNewChannel:
		var body models.JoinNewChannelEvent
		mapstructure.Decode(msg.Body, &body)
		broadcastNewChannelJoin(client, body)

	case models.E_LeaveChannel:
		var body models.LeaveChannelEvent
		mapstructure.Decode(msg.Body, &body)
		broadcastChannelLeave(client, body)

	case models.E_ChatMessage:
		var body models.SendMessageEvent
		mapstructure.Decode(msg.Body, &body)
		broadcastMessage(client, body)

	case models.E_DeleteMessage:
		var body models.DeleteMessageEvent
		mapstructure.Decode(msg.Body, &body)
		broadcastMessageDelete(client, body)

	case models.E_UploadLogo:
		var body models.UploadLogoEvent
		mapstructure.Decode(msg.Body, &body)
		handleUploadLogo(client, body)
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

func (client *Client) leaveGuild(id string) {
	newGuildList := []string{}
	for _, guildId := range client.Guilds {
		if guildId != id {
			newGuildList = append(newGuildList, guildId)
		}
	}
	client.Guilds = newGuildList
}
