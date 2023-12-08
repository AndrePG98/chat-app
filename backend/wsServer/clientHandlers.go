package main

import "log"

func (client *Client) handleRegistration(newMessage Message) {
	if body, ok := newMessage.Body.(map[string]interface{}); ok {
		userId := body["userId"].(string)
		client.Guilds = append(client.Guilds, "1")
		client.Server.Authorize <- &Message{
			Type: newMessage.Type,
			Body: Registration{
				UserId: userId,
				Result: true,
			},
		}
	}
}

func (client *Client) handleLogin(newMessage Message) {
	if body, ok := newMessage.Body.(map[string]interface{}); ok {
		userId := body["userId"].(string)
		// fetch userData
		client.Guilds = append(client.Guilds, "1") // append to fetched guilds
		client.Server.Authorize <- &Message{
			Type: newMessage.Type,
			Body: Login{
				UserId: userId,
				Result: true, // can return based on database search result
			},
		}
	}
}

func (client *Client) handleChatMessage(newMessage Message) {
	if body, ok := newMessage.Body.(map[string]interface{}); ok {
		userId := body["userId"].(string)
		guildId := body["guildId"].(string)
		channelId := body["channelId"].(string)
		content := body["content"].(string)
		log.Printf("%+v", newMessage)
		for _, user := range client.Server.AuthClients {
			if user.isMemberOfGuild(guildId) {
				go func(user *Client) {
					user.Send <- Message{
						Type: 3,
						Body: ChatMessage{
							UserId:    userId,
							GuildId:   guildId,
							ChannelId: channelId,
							Content:   content,
						},
					}
				}(user)
			}
		}
	}
}
