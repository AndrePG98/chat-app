package main

import (
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

// Add client guildIds to the models.User so the receivers know which guilds to update
func broadcastLogin(client *Client) {
	for _, guildId := range client.Guilds {
		for _, userId := range client.Server.Guilds[guildId] {
			client.Server.AuthClients[userId].Send <- &models.IMessage{
				Type: models.B_Login,
				Body: &models.LoginBroadcast{
					User: models.User{
						UserId:   client.ID,
						Username: client.Username,
						Email:    "Some@Email",
						Logo:     "https://source.unsplash.com/random/150x150/?avatar",
					},
				},
			}
		}
	}
}

func broadcastLogout(client *Client) {
	defer client.Conn.Close()
	for _, guildId := range client.Guilds {
		client.Server.Update <- &models.UpdateGuilds{
			Type:    models.R_GuildLeave,
			GuildId: guildId,
			UserId:  client.ID,
		}
		for _, userId := range client.Server.Guilds[guildId] {
			if userId != client.ID {
				client.Server.AuthClients[userId].Send <- &models.IMessage{
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

func broadcastGuildDelete(client *Client, msg models.DeleteGuildEvent) {
	client.leaveGuild(msg.GuildId)
	for _, userId := range client.Server.Guilds[msg.GuildId] {
		client.Server.AuthClients[userId].leaveGuild(msg.GuildId)
		client.Server.AuthClients[userId].Send <- &models.IMessage{
			Type: models.B_GuildDelete,
			Body: models.GuildDeleteBroadcast{
				GuildId: msg.GuildId,
			},
		}
	}
	client.Server.Update <- &models.UpdateGuilds{
		Type:    models.B_GuildDelete,
		GuildId: msg.GuildId,
		UserId:  "",
	}
}

func broadcastGuildJoin(client *Client, msg models.JoinGuildEvent) {
	for _, userId := range client.Server.Guilds[msg.GuildId] {
		if userId != client.ID {
			client.Server.AuthClients[userId].Send <- &models.IMessage{
				Type: models.B_GuildJoin,
				Body: models.GuildJoinBroadcast{
					User:    msg.Member,
					GuildId: msg.GuildId,
				},
			}
		}
	}
}

func broadcastGuildLeave(client *Client, msg models.LeaveGuildEvent) {
	for _, userId := range client.Server.Guilds[msg.GuildId] {
		if userId != client.ID {
			client.Server.AuthClients[userId].Send <- &models.IMessage{
				Type: models.B_GuildLeave,
				Body: models.GuildLeaveBroadcast{
					UserId:  client.ID,
					GuildId: msg.GuildId,
				},
			}
		}
	}
}

func broadcastChannelCreate(client *Client, msg models.CreateChannelEvent) {
	for _, userId := range client.Server.Guilds[msg.GuildId] {
		client.Server.AuthClients[userId].Send <- &models.IMessage{
			Type: models.B_ChannelCreate,
			Body: models.CreateChannelBroadcast{
				GuildId:     msg.GuildId,
				ChannelId:   uuid.NewString(),
				ChannelName: msg.ChannelName,
				ChannelType: msg.ChannelType,
			},
		}
	}
}

func broadcastChannelDelete(client *Client, msg models.DeleteChannelEvent) {
	for _, userId := range client.Server.Guilds[msg.GuildId] {
		client.Server.AuthClients[userId].Send <- &models.IMessage{
			Type: models.B_ChannelDelete,
			Body: models.DeleteChannelBroadcast{
				GuildId:   msg.GuildId,
				ChannelId: msg.ChannelId,
			},
		}
	}
}

func broadcastChannelJoin(client *Client, msg models.JoinChannelEvent) {
	for _, userId := range client.Server.Guilds[msg.GuildId] {
		client.Server.AuthClients[userId].Send <- &models.IMessage{
			Type: models.B_JoinChannel,
			Body: models.JoinChannelBroadcast(msg),
		}
	}
}

func broadcastChannelLeave(client *Client, msg models.LeaveChannelEvent) {
	for _, userId := range client.Server.Guilds[msg.GuildId] {
		client.Server.AuthClients[userId].Send <- &models.IMessage{
			Type: models.B_LeaveChannel,
			Body: models.LeaveChannelBroadcast{
				GuildId:   msg.GuildId,
				ChannelId: msg.ChannelId,
				UserId:    msg.UserId,
			},
		}
	}
}

func broadcastMessage(client *Client, msg models.SendMessageEvent) {
	for _, userId := range client.Server.Guilds[msg.GuildId] {
		client.Server.AuthClients[userId].Send <- &models.IMessage{
			Type: models.B_ChatMessage,
			Body: models.MessageBroadcast{
				Message: models.Message{
					ID:        uuid.NewString(),
					Sender:    msg.Sender,
					GuildId:   msg.GuildId,
					ChannelId: msg.ChannelId,
					SendAt:    msg.SendAt,
					Content:   msg.Content,
				},
			},
		}
	}
}

func broadcastMessageDelete(client *Client, msg models.DeleteMessageEvent) {
	for _, userId := range client.Server.Guilds[msg.GuildId] {
		client.Server.AuthClients[userId].Send <- &models.IMessage{
			Type: models.B_ChatMessageDelete,
			Body: models.MessageDeleteBroadcast{
				GuildId:   msg.GuildId,
				ChannelId: msg.ChannelId,
				MessageId: msg.MessageId,
			},
		}
	}
}
