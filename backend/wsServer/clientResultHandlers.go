package main

import (
	"wsServer/models"

	"github.com/google/uuid"
)

func handleRegistration(client *Client, regEvent models.RegisterEvent) {
	username := regEvent.Username
	password := regEvent.Password
	email := regEvent.Email

	id, token, err := client.Server.Database.CreateUser(username, password, email) // create user in db and return uuid
	if err != nil {
		client.Server.Authenticate <- &AuthRequest{
			Result: false,
			Client: client,
			Error:  err.Error(),
		}
	} else {
		client.authenticate(id, username)
		client.Server.Authenticate <- &AuthRequest{
			Result: true,
			Client: client,
			Token:  token,
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

func handleCreateGuild(client *Client, msg models.CreateGuildEvent) {
	guildId := uuid.NewString()
	client.joinGuild(guildId)
	client.Server.Update <- &models.UpdateGuilds{
		Type:    models.R_GuildJoin,
		GuildId: guildId,
		UserId:  client.ID,
	}
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

func handleJoinGuild(client *Client, msg models.JoinGuildEvent) {
	client.Server.Update <- &models.UpdateGuilds{
		Type:    models.R_GuildJoin,
		GuildId: msg.GuildId,
		UserId:  client.ID,
	}
	client.joinGuild(msg.GuildId)
	client.Send <- &models.IMessage{
		Type: models.R_GuildJoin,
		Body: models.JoinGuildResult{
			Guild: models.Guild{}, // fetch from database
		},
	}
	broadcastGuildJoin(client, msg)
}

func handleLeaveGuild(client *Client, msg models.LeaveGuildEvent) {
	client.leaveGuild(msg.GuildId)
	client.Server.Update <- &models.UpdateGuilds{
		Type:    models.R_GuildLeave,
		GuildId: msg.GuildId,
		UserId:  client.ID,
	}
	client.Send <- &models.IMessage{
		Type: models.R_GuildLeave,
		Body: models.LeaveGuildResult{
			GuildId: msg.GuildId,
		},
	}
	broadcastGuildLeave(client, msg)
}
