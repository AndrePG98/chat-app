package models

/*
Message Types :
1. Text Channel Message - Updates the chat of the specified channel in the specified server.
2. Add User to Voice channel - Updates the ui of the server members
3. Add User to Server - Updates the ui of the server members
Missing - notifications and dm
*/

type Message struct {
	Type int         `json:"type"`
	Body interface{} `json:"body"`
}

type ChatMessage struct { // Send user
	UserId    string `json:"userId"`
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
	Message   string `json:"message"`
}

type InitialConnect struct {
	UserId   string   `json:"userId"`
	GuildIds []string `json:"guildIds"`
}
