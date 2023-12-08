package main

func (client *Client) handleInitalConnMessage(newMessage Message) {
	body, _ := newMessage.Body.(map[string]interface{})
	if guildIDs, ok := body["guildIds"].([]interface{}); ok {
		for _, id := range guildIDs {
			if guildID, ok := id.(string); ok {
				client.Guilds = append(client.Guilds, guildID)
			}
		}
	}
}

func (client *Client) handleChatMessage(newMessage Message) {
	if chatMessage, ok := newMessage.Body.(map[string]interface{}); ok {
		userId := chatMessage["userId"].(string)
		guildId := chatMessage["guildId"].(string)
		channelId := chatMessage["channelId"].(string)
		message := chatMessage["message"].(string)

		for _, user := range client.Server.Clients {
			if user.isMemberOfGuild(guildId) {
				go func(user *Client) {
					user.Send <- Message{
						Type: 1,
						Body: ChatMessage{
							UserId:    userId,
							GuildId:   guildId,
							ChannelId: channelId,
							Message:   message,
						},
					}
				}(user)
			}
		}
	}
}
