package models

type Channel struct {
	ID      string    `json:"channelId"`
	GuildId string    `json:"guildID"`
	Name    string    `json:"channelName"`
	Type    string    `json:"channelType"`
	Members []User    `json:"members"`
	History []Message `json:"history"`
}

type Message struct {
	ID        string `json:"messageId"`
	Sender    User   `json:"sender"`
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
	Content   string `json:"content"`
	SendAt    string `json:"sendAt"`
}

// ################################## EVENTS ###########################################

type CreateChannelEvent struct {
	UserId      string `json:"userId"`
	GuildId     string `json:"guildId"`
	ChannelName string `json:"channelName"`
	ChannelType string `json:"channelType"`
}

type DeleteChannelEvent struct {
	UserId    string `json:"userId"`
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
}

type JoinChannelEvent struct {
	UserId    string `json:"userId"`
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
}

type LeaveChannelEvent struct {
	UserId    string `json:"userId"`
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
}

type SendMessageEvent struct {
	Sender    User   `json:"sender"`
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
	SendAt    string `json:"sendAt"`
	Content   string `json:"content"`
}

type DeleteMessageEvent struct {
	UserId    string `json:"userId"`
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
	MessageId string `json:"messageId"`
}

// ################################## EVENTS ###########################################

// ################################## RESULTS ##############################################

// ################################## RESULTS ##############################################

// ################################## BROADCASTS ##############################################

type CreateChannelBroadcast struct {
	GuildId     string `json:"guildId"`
	ChannelId   string `json:"channelId"`
	ChannelName string `json:"channelName"`
	ChannelType string `json:"channelType"`
}

type DeleteChannelBroadcast struct {
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
}

type JoinChannelBroadcast struct {
	User      User   `json:"user"`
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
}

type LeaveChannelBroadcast struct {
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
	UserId    string `json:"userId"`
}

type MessageBroadcast struct {
	Message Message `json:"message"`
}

type MessageDeleteBroadcast struct {
	GuildId   string `json:"guildId"`
	ChannelId string `json:"channelId"`
	MessageId string `json:"messageId"`
}
