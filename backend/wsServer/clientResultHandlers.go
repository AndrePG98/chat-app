package main

import (
	"encoding/base64"
	"log"
	"strings"
	"wsServer/models"

	"github.com/google/uuid"
)

type AuthRequest struct {
	Result   bool
	Client   *Client
	Email    string
	Logo     string
	IsMuted  bool
	IsDeafen bool
	Token    string
	Error    string
	State    []models.Guild
	Invites  []models.Invite
}

func handleRegistration(client *Client, regEvent models.RegisterEvent) {
	username := regEvent.Username
	password := regEvent.Password
	email := regEvent.Email

	id, token, err := client.Server.Database.CreateUser(username, password, email)
	if err != nil {
		client.Server.Authenticate <- &AuthRequest{
			Result: false,
			Client: client,
			Error:  err.Error(),
		}
	} else {
		client.authenticate(id, username)
		client.Server.Authenticate <- &AuthRequest{
			Result:   true,
			Client:   client,
			Email:    email,
			Logo:     "",
			IsMuted:  false,
			IsDeafen: false,
			Token:    token,
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
	var logo []byte
	var ismuted, isdeafen bool
	var base64Image string
	var state []models.Guild
	var invites []models.Invite
	if len(token) == 0 {
		id, email, logo, ismuted, isdeafen, token, state, invites, err = client.Server.Database.FetchUserByPassword(username, password)
		base64Image = "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(logo)
	} else {
		id, username, email, logo, ismuted, isdeafen, token, state, invites, err = client.Server.Database.FetchUserByToken(token)
		base64Image = "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(logo)
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
			Result:   true,
			Client:   client,
			Email:    email,
			Logo:     base64Image,
			IsMuted:  ismuted,
			IsDeafen: isdeafen,
			State:    state,
			Invites:  invites,
			Token:    token,
		}
	}
}

func handleCreateGuild(client *Client, msg models.CreateGuildEvent) {
	guildId := uuid.NewString()
	_, email, logo, ismuted, isdeafen, err := client.Server.Database.FetchUserInfo(msg.OwnerId)
	base64Image := "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(logo)
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
						Logo:     base64Image,
						IsMuted:  ismuted,
						IsDeafen: isdeafen,
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
			Guild: *guild,
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
	split := strings.Split(msg.Image, ",")
	decodedImage, err := base64.StdEncoding.DecodeString(split[1])
	if err != nil {
		log.Printf("error decoding image: %v", err)
		return
	}
	userIds, err := client.Server.Database.UploadLogo(decodedImage, msg.UserId, client.Guilds)
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
	broadcastUpdateLogo(client, userIds, client.Guilds, msg.Image)

}

func fetchUsers(client *Client, msg models.FetchUsersEvent) {
	users, hasMore, err := client.Server.Database.FetchUsers(msg.SearchTerm, msg.Limit, msg.Offset)
	if err != nil {
		log.Println(err.Error())
		return
	}
	client.Send <- &models.IMessage{
		Type: models.R_FetchUsers,
		Body: models.FetchUsersResult{
			Users:   users,
			HasMore: hasMore,
		},
	}

}

func invite(client *Client, msg models.InviteEvent) {
	id := uuid.NewString()
	err := client.Server.Database.SaveInvitation(id, msg)
	if err != nil {
		log.Println(err.Error())
		return
	}
	user, isOnline := client.Server.AuthClients[msg.ReceiverId]
	if isOnline {
		user.Send <- &models.IMessage{
			Type: models.R_Invitation,
			Body: models.InvitationResult{
				Invite: models.Invite{
					Id:         id,
					Sender:     msg.Sender,
					ReceiverId: client.ID,
					GuildId:    msg.GuildId,
					GuildName:  msg.GuildName,
					SendAt:     msg.SendAt,
				},
			},
		}
	}
}
