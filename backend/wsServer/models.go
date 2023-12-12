package main

type Message struct {
	Type int         `json:"type"`
	Body interface{} `json:"body"`
}

type AuthRequest struct { // Connection sends to server
	Result bool
	Client *Client
}

type AuthenticationResult struct { // Sends to client
	Result   bool     `json:"result"`
	Token    string   `json:"token"`
	ID       string   `json:"userId"`
	UserName string   `json:"userName"`
	State    []string `json:"state"`
	Error    string   `json:"error"` // if result if false empty otherwise
}

type Guild struct {
	ID      string // unique globally
	Name    string
	Members []string // user ids
	Channel []string // maybe channel ids unique inside the guild but not globablly
}

type Channel struct {
	ID      string // unique inside guild
	Name    string
	Type    string    // text, voice
	Members []string  // voice channel users , empty if text channel
	History []Message // text channel chat history , empty if voice channel
}

type ChatMessage struct { // Send user
	UserId    string `json:"userId"`
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
	Content   string `json:"content"`
}
