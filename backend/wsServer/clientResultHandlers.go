package main

import (
	"encoding/base64"
	"log"
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
			Email:  email,
			Logo:   "",
			Token:  token,
		}
	}
}

func handleLogin(client *Client, logEvent models.LoginEvent) {
	username := logEvent.Username
	password := logEvent.Password
	token := logEvent.Token
	var err error
	var id string
	var email string
	var logo string
	var state []models.Guild
	if len(token) == 0 {
		id, email, logo, token, state, err = client.Server.Database.FetchUserByPassword(username, password)
	} else {
		id, username, email, logo, token, state, err = client.Server.Database.FetchUserByToken(token)
	}
	if err != nil {
		client.Server.Authenticate <- &AuthRequest{
			Result: false,
			Client: client,
			Error:  err.Error(),
		}
	} else {
		client.authenticate(id, username)
		client.joinGuilds(state)
		client.Server.Authenticate <- &AuthRequest{
			Result: true,
			Client: client,
			Email:  email,
			Logo:   logo,
			State:  state,
			Token:  token,
		}
		//broadcastLogin(client)
	}
}

func handleCreateGuild(client *Client, msg models.CreateGuildEvent) {
	guildId := uuid.NewString()
	_, email, logo, err := client.Server.Database.FetchUserInfo(msg.OwnerId)
	if err != nil {
		log.Println(err.Error())
		return
	}
	err = client.Server.Database.CreateGuild(guildId, msg.GuildName, msg.OwnerId)
	if err != nil {
		log.Println(err.Error())
		return
	}
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
						Email:    email,
						Logo:     logo,
					},
				},
				Channels: []models.Channel{},
			},
		},
	}
}

func handleJoinGuild(client *Client, msg models.JoinGuildEvent) {
	userIds, guild, err := client.Server.Database.JoinGuild(msg.GuildId, msg.Member.UserId)
	if err != nil {
		log.Println(err.Error())
		return
	}
	client.joinGuild(msg.GuildId)
	client.Send <- &models.IMessage{
		Type: models.R_GuildJoin,
		Body: models.JoinGuildResult{
			Guild: guild,
		},
	}
	broadcastGuildJoin(client, userIds, msg.GuildId, msg.Member)
}

func handleLeaveGuild(client *Client, msg models.LeaveGuildEvent) {
	userIds, err := client.Server.Database.LeaveGuild(msg.GuildId, msg.MemberId)
	if err != nil {
		log.Println(err.Error())
		return
	}
	client.leaveGuild(msg.GuildId)
	client.Send <- &models.IMessage{
		Type: models.R_GuildLeave,
		Body: models.LeaveGuildResult{
			GuildId: msg.GuildId,
		},
	}
	broadcastGuildLeave(client, userIds, msg.GuildId)
}

func handleUploadLogo(client *Client, msg models.UploadLogoEvent) {
	decodedImage, err := base64.StdEncoding.DecodeString(msg.Image)
	if err != nil {
		log.Printf("error decoding image: %v", err)
		return
	}
	err = client.Server.Database.UploadLogo(decodedImage, msg.UserId)
	if err != nil {
		log.Println(err.Error())
		return
	}
	client.Send <- &models.IMessage{
		Type: models.R_UploadLogo,
		Body: models.UploadLogoResult{
			Image: msg.Image,
			Error: "",
		},
	}

}
