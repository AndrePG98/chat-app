package main

import (
	"log"
	"wsServer/models"

	"github.com/google/uuid"
)

type AuthRequest struct {
	Result bool
	Client *Client
	Token  string
	Error  string
	State  []models.Guild
}

func handleRegistration(client *Client, regEvent models.RegisterEvent) {
	username := regEvent.Username
	password := regEvent.Password

	result, id, token := CreateUser(username, password) // create user in db and return uuid
	if result {
		client.authenticate(id, username)
		client.Server.Authenticate <- &AuthRequest{
			Result: true,
			Client: client,
			Token:  token,
		}
	} else {
		client.Server.Authenticate <- &AuthRequest{
			Result: false,
			Client: client,
			Error:  "Some Error",
		}
	}
}

func handleLogin(client *Client, logEvent models.LoginEvent) {
	username := logEvent.Username
	password := logEvent.Password
	token := logEvent.Token
	var result bool
	var id string
	var state []models.Guild
	if len(token) == 0 {
		result, id, token, state = FetchUserByPassword(username, password)
	} else {
		result, id, token, username, state = FetchUserByToken(token)
	}
	if result {
		client.authenticate(id, username)
		client.joinGuilds(state)
		client.Server.Authenticate <- &AuthRequest{
			Result: true,
			Client: client,
			State:  state,
			Token:  token,
		}
		broadcastLogin(client)
	} else {
		client.Server.Authenticate <- &AuthRequest{
			Result: false,
			Client: client,
			Error:  "Some Error",
		}
	}
}

func broadcastLogin(client *Client) {
	for _, c := range client.Server.AuthClients {
		commonGuilds := matching(client.Guilds, c.Guilds)
		if len(commonGuilds) > 0 {
			c.Send <- &models.IMessage{
				Type: models.B_Login,
				Body: &models.LoginBroadcast{
					User: models.User{
						UserId:   client.ID,
						Username: c.Username,
						Email:    "Some@Email",
						Logo:     "https://source.unsplash.com/random/150x150/?avatar",
					},
				},
			}
		}
	}
}

func handleLogout(client *Client) {
	defer client.Conn.Close()
	for _, guildId := range client.Guilds {
		for _, v := range client.Server.AuthClients {
			if v.isMemberOfGuild(guildId) && v.ID != client.ID {
				v.Send <- &models.IMessage{
					Type: models.B_Logout,
					Body: &models.LogoutBroadcast{
						Username: client.Username,
						GuildIds: client.Guilds,
					},
				}
			}
		}
	}
}

func handleChatMessage(client *Client, messageEvent models.SendMessageEvent) {
	for _, user := range client.Server.AuthClients {
		if user.isMemberOfGuild(messageEvent.GuildId) {
			go func(user *Client) {
				user.Send <- &models.IMessage{
					Type: models.B_ChatMessage,
					Body: models.MessageBroadcast{
						Message: models.Message{
							ID:        uuid.NewString(),
							Sender:    messageEvent.Sender,
							GuildId:   messageEvent.GuildId,
							ChannelId: messageEvent.ChannelId,
							SendAt:    messageEvent.SendAt,
							Content:   messageEvent.Content,
						},
					},
				}
			}(user)
		}
	}
}

func handleCreateGuild(client *Client, msg models.CreateGuildEvent) {
	log.Println(msg)
	guildId := uuid.NewString()
	client.joinGuild(guildId)
	client.Send <- &models.IMessage{
		Type: models.R_GuildJoin,
		Body: models.JoinGuildResult{
			Guild: models.Guild{
				ID:      guildId,
				OwnerId: client.ID,
				Name:    msg.GuildName,
				Members: []models.User{
					{
						UserId:   client.ID,
						Username: client.Username,
						Email:    "Some@Emai",
						Logo:     "https://source.unsplash.com/random/150x150/?avatar",
					},
				},
				Channels: []models.Channel{},
			},
		},
	}
}

func handleCreateChannel(client *Client, msg models.CreateChannelEvent) {
	for _, user := range client.Server.AuthClients {
		if user.isMemberOfGuild(msg.GuildId) {
			go func(user *Client) {
				user.Send <- &models.IMessage{
					Type: models.B_ChannelCreate,
					Body: models.CreateChannelBroadcast{
						GuildId:     msg.GuildId,
						ChannelId:   uuid.NewString(),
						ChannelName: msg.ChannelName,
						ChannelType: msg.ChannelType,
					},
				}
			}(user)
		}
	}
}

func matching(slice1 []string, slice2 []string) []string {
	matches := make([]string, 0)
	for _, a := range slice1 {
		for _, b := range slice2 {
			if a == b {
				matches = append(matches, a)
			}
		}
	}
	return matches
}
