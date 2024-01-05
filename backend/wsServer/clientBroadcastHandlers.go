package main

import (
	"log"
	"time"
	"wsServer/models"

	"github.com/google/uuid"
)

type AuthRequest struct {
	Result bool
	Client *Client
	Email  string
	Logo   string
	Token  string
	Error  string
	State  []models.Guild
}

func broadcastLogout(client *Client) {
	defer client.Conn.Close()
	channelId, guildId, err := client.Server.Database.GetCurrentUserChannel(client.ID)
	if err != nil {
		log.Println(err.Error())
		return
	}
	broadcastChannelLeave(client, models.LeaveChannelEvent{UserId: client.ID, GuildId: guildId, ChannelId: channelId})

}

func broadcastGuildDelete(client *Client, msg models.DeleteGuildEvent) {
	userIds, err := client.Server.Database.DeleteGuild(msg.GuildId, msg.UserId)
	if err != nil {
		log.Println(err.Error())
		return
	}
	client.leaveGuild(msg.GuildId)
	for _, userId := range userIds {
		client.Server.AuthClients[userId].leaveGuild(msg.GuildId)
		client.Server.AuthClients[userId].Send <- &models.IMessage{
			Type: models.B_GuildDelete,
			Body: models.GuildDeleteBroadcast{
				GuildId: msg.GuildId,
			},
		}
	}
}

func broadcastGuildJoin(client *Client, userIds []string, guildId string, member models.User) {

	for _, userId := range userIds {
		if userId != client.ID {
			client.Server.AuthClients[userId].Send <- &models.IMessage{
				Type: models.B_GuildJoin,
				Body: models.GuildJoinBroadcast{
					User:    member,
					GuildId: guildId,
				},
			}
		}
	}
}

func broadcastGuildLeave(client *Client, userIds []string, guildId string) {
	for _, userId := range userIds {
		if userId != client.ID {
			client.Server.AuthClients[userId].Send <- &models.IMessage{
				Type: models.B_GuildLeave,
				Body: models.GuildLeaveBroadcast{
					UserId:  client.ID,
					GuildId: guildId,
				},
			}
		}
	}
}

func broadcastChannelCreate(client *Client, msg models.CreateChannelEvent) {
	chanId := uuid.NewString()
	userIds, err := client.Server.Database.CreateChannel(msg.GuildId, chanId, msg.ChannelType, msg.ChannelName)
	if err != nil {
		log.Println(err.Error())
		return
	}
	for _, userId := range userIds {
		client.Server.AuthClients[userId].Send <- &models.IMessage{
			Type: models.B_ChannelCreate,
			Body: models.CreateChannelBroadcast{
				GuildId:     msg.GuildId,
				ChannelId:   chanId,
				ChannelName: msg.ChannelName,
				ChannelType: msg.ChannelType,
			},
		}
	}
}

func broadcastChannelDelete(client *Client, msg models.DeleteChannelEvent) {
	userIds, err := client.Server.Database.DeleteChannel(msg.GuildId, msg.ChannelId)
	if err != nil {
		log.Println(err.Error())
		return
	}
	for _, userId := range userIds {
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

	userIds, err := client.Server.Database.JoinChannel(msg.GuildId, msg.ChannelId, msg.User.UserId)
	if err != nil {
		log.Println(err.Error())
		return
	}

	for _, userId := range userIds {
		client.Server.AuthClients[userId].Send <- &models.IMessage{
			Type: models.B_JoinChannel,
			Body: models.JoinChannelBroadcast(msg),
		}
	}
}

func broadcastNewChannelJoin(client *Client, msg models.JoinNewChannelEvent) {
	doneChan := make(chan bool)
	go func() {
		broadcastChannelLeave(client, models.LeaveChannelEvent{
			UserId:    msg.User.UserId,
			GuildId:   msg.PrevChannel.GuildId,
			ChannelId: msg.PrevChannel.ChannelId,
		})
		time.Sleep(time.Millisecond * 2)
		doneChan <- true
	}()

	for isDone := range doneChan {
		if isDone {
			broadcastChannelJoin(client, models.JoinChannelEvent{
				User:      msg.User,
				GuildId:   msg.NewChannel.GuildId,
				ChannelId: msg.NewChannel.ChannelId,
			})
			return
		}
	}
}

func broadcastChannelLeave(client *Client, msg models.LeaveChannelEvent) {
	userIds, err := client.Server.Database.LeaveChannel(msg.GuildId, msg.ChannelId, msg.UserId)
	if err != nil {
		log.Println(err.Error())
		return
	}
	for _, userId := range userIds {
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
	id := uuid.NewString()
	userIds, err := client.Server.Database.SaveMessage(id, msg.GuildId, msg.ChannelId, msg.Sender.UserId, msg.Content, msg.SendAt)
	if err != nil {
		log.Println(err.Error())
		return
	}
	for _, userId := range userIds {
		client.Server.AuthClients[userId].Send <- &models.IMessage{
			Type: models.B_ChatMessage,
			Body: models.MessageBroadcast{
				Message: models.Message{
					ID:        id,
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
	userIds, err := client.Server.Database.DeleteMessage(msg.MessageId, msg.GuildId, msg.ChannelId)
	if err != nil {
		log.Println(err.Error())
		return
	}
	for _, userId := range userIds {
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

func broadcastUpdateLogo(client *Client, userIds []string, guildIds []string, img string) {
	// loop through userIds and send the guildids and the userId each needs to update the image
	// in the client the user loops through each guild, each channel ,each message and member and update the image if the id matches the userId
	for _, userId := range userIds {
		client.Server.AuthClients[userId].Send <- &models.IMessage{
			Type: models.B_UploadLogo,
			Body: models.UploadLogoBroadcast{
				UserId:   client.ID,
				GuildIds: guildIds,
				Image:    img,
			},
		}
	}
}
