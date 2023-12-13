package main

func handleRegistration(client *Client, newMessage Message) {
	if body, ok := newMessage.Body.(map[string]interface{}); ok {
		username := body["username"].(string)
		password := body["password"].(string)
		email := body["email"].(string)

		result, id := CreateUser(username, password, email) // create user in db and return uuid
		if result {
			client.authenticate(id, username, []string{})
			client.Server.Authenticate <- &AuthRequest{
				Result: true,
				Client: client,
			}
		} else {
			client.Conn.WriteJSON(
				Message{
					Type: 0,
					Body: AuthenticationResult{
						Result: result,
						Error:  "Some Error",
					},
				},
			)
		}
	}
}

func handleLogin(client *Client, newMessage Message) {
	if body, ok := newMessage.Body.(map[string]interface{}); ok {
		username := body["username"].(string)
		password := body["password"].(string)
		email := body["email"].(string)
		// Database operations here
		// returns id
		result, id := CreateUser(username, password, email)
		if result {
			client.authenticate(id, username, []string{"1"})
			client.Server.Authenticate <- &AuthRequest{
				Result: true,
				Client: client,
			}
		} else {
			client.Server.Authenticate <- &AuthRequest{
				Result: false,
				Client: client,
			}
		}
	}
}

func handleChatMessage(client *Client, newMessage Message) {
	if body, ok := newMessage.Body.(map[string]interface{}); ok {
		userId := body["userId"].(string)
		guildId := body["guildId"].(string)
		channelId := body["channelId"].(string)
		content := body["content"].(string)
		for _, user := range client.Server.AuthClients {
			if user.isMemberOfGuild(guildId) {
				go func(user *Client) {
					user.Send <- &Message{
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
