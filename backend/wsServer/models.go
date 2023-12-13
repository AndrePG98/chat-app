package main

import "time"

type AuthenticationResult struct { // Sends to client
	Result   bool     `json:"result"`
	Token    string   `json:"token"`
	ID       string   `json:"userId"`
	UserName string   `json:"userName"`
	State    []string `json:"state"`
	Error    string   `json:"error"` // if result if false empty otherwise
}

type Guild struct {
	ID       string    `json:"guildId"`
	OwnerId  string    `json:"ownerId"`
	Name     string    `json:"guildName"`
	Members  []User    `json:"members"`
	Channels []Channel `json:"chanels"`
}

type Channel struct {
	ID      string    `json:"channelId"`
	GuildId string    `json:"guildID"`
	Name    string    `json:"channelName"`
	Type    string    `json:"channelType"`
	Members []string  `json:"members"`
	History []Message `json:"history"`
}

type Message struct {
	SenderId  string    `json:"senderId"`
	GuildId   string    `json:"guildId"`
	ChannelId string    `json:"channelId"`
	Content   string    `json:"content"`
	SendAt    time.Time `json:"sendAt"`
}
