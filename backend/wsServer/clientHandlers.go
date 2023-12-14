package main

import (
	"time"
	"wsServer/models"
)

type AuthRequest struct {
	Result bool
	Client *Client
	State  []models.Guild
}

func handleRegistration(client *Client, regEvent models.RegisterEvent) {

	username := regEvent.Username
	password := regEvent.Password
	email := regEvent.Email

	result, id := CreateUser(username, password, email) // create user in db and return uuid
	if result {
		client.authenticate(id, username, []string{})
		client.Server.Authenticate <- &AuthRequest{
			Result: true,
			Client: client,
		}
	} else {
		client.Conn.WriteJSON(
			models.IMessage{
				Type: 0,
				Body: models.AcessResult{
					Result: result,
					Error:  "Some Error",
				},
			},
		)
	}
}

func handleLogin(client *Client, logEvent models.LoginEvent) {
	username := logEvent.Username
	password := logEvent.Password
	// Database operations here
	// return state
	result, id := FetchUser(username, password)
	// Hardcoded State
	guild1 := models.Guild{
		ID:      "1",
		OwnerId: id,
		Name:    "Guild1",
		Members: []models.User{
			{
				UserId:   id,
				Username: username,
				Logo:     "https://source.unsplash.com/random/150x150/?avatar",
			},
		},
		Channels: []models.Channel{
			{
				ID:      "1",
				GuildId: "1",
				Name:    "Channel1",
				Type:    "text",
				History: []models.Message{
					{
						Sender: models.User{
							UserId:   id,
							Username: username,
							Logo:     "https://source.unsplash.com/random/150x150/?avatar",
						},
						GuildId:   "1",
						ChannelId: "1",
						Content:   "Test Message",
						SendAt:    time.Now().Format("02/01/2006"),
					},
				},
			},
		},
	}
	if result {
		client.authenticate(id, username, []string{"1"})
		client.Server.Authenticate <- &AuthRequest{
			Result: true,
			Client: client,
			State: []models.Guild{
				guild1,
			},
		}
	} else {
		client.Conn.WriteJSON(
			models.IMessage{
				Type: 0,
				Body: models.AcessResult{
					Result: result,
					Error:  "Some Error",
				},
			},
		)
	}
}

func handleChatMessage(client *Client, messageEvent models.SendMessageEvent) {
	for _, user := range client.Server.AuthClients {
		if user.isMemberOfGuild(messageEvent.GuildId) {
			go func(user *Client) {
				user.Send <- &models.IMessage{
					Type: 3,
					Body: models.MessageBroadcast{
						Message: models.Message{
							Sender: models.User{
								UserId:   messageEvent.SenderId,
								Username: client.Username,
								Logo:     "https://source.unsplash.com/random/150x150/?avatar",
							},
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
