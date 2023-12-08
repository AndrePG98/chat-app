package main

type Message struct {
	Type int         `json:"type"`
	Body interface{} `json:"body"`
}

type Registration struct {
	UserId string `json:"userId"`
	Result bool   `json:"result"`
}

type Login struct {
	UserId string `json:"userId"`
	Result bool   `json:"result"`
}

type ChatMessage struct { // Send user
	UserId    string `json:"userId"`
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
	Content   string `json:"content"`
}
