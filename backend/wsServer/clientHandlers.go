package main

import (
	"wsServer/models"
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
	email := regEvent.Email

	result, id, token := CreateUser(username, password, email) // create user in db and return uuid
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
		result, id, token, state = FetchUserByToken(token)
	}
	if result {
		client.authenticate(id, username)
		client.JoinGuilds(state)
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
				Type: 1,
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
					Type: 2,
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
					Type: 3,
					Body: models.MessageBroadcast{
						Message: models.Message{
							Sender: models.User{
								UserId:   messageEvent.SenderId,
								Username: client.Username,
								Email:    "Some@Email",
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
