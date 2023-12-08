package main

type Message struct {
	Type int         `json:"type"`
	Body interface{} `json:"body"`
}

type InitialConnect struct {
	UserId   string   `json:"userId"`
	GuildIds []string `json:"guildIds"`
}

type ChatMessage struct { // Send user
	UserId    string `json:"userId"`
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
	Message   string `json:"message"`
}
