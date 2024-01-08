package models

type IMessage struct {
	Type int         `json:"type"`
	Body interface{} `json:"body"`
}

type User struct {
	UserId   string `json:"userId"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Logo     string `json:"logo"`
	IsMuted  bool   `json:"isMuted"`
	IsDeafen bool   `json:"isDeafen"`
}

// ################################## EVENTS ###########################################

type RegisterEvent struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
	Logo     []byte `json:"logo"`
}

type LoginEvent struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Token    string `json:"token"`
}

type LogoutEvent struct {
	UserId string `json:"userId"`
}

type UploadLogoEvent struct {
	Image  string `json:"image"`
	UserId string `json:"userId"`
}

type MuteEvent struct {
	UserId    string `json:"userId"`
	ChannelId string `json:"channelId"`
	GuildId   string `json:"guildId"`
}

type DeafenEvent struct {
	UserId    string `json:"userId"`
	ChannelId string `json:"channelId"`
	GuildId   string `json:"guildId"`
}

type FetchUsersEvent struct {
	SearchTerm string `json:"searchTerm"`
	Offset     int    `json:"offset"`
	Limit      int    `json:"limit"`
}

// ################################## EVENTS ###########################################

// ################################## RESULTS ##############################################

// Response for both Register and Login events. Sends empty state if registering
type AcessResult struct {
	Result   bool    `json:"result"`
	Token    string  `json:"token"`
	UserId   string  `json:"userId"`
	Username string  `json:"username"`
	Email    string  `json:"email"`
	Logo     string  `json:"logo"`
	IsMuted  bool    `json:"ismuted"`
	IsDeafen bool    `json:"isdeafen"`
	State    []Guild `json:"state"`
	Error    string  `json:"error"`
}

type UploadLogoResult struct {
	Image string `json:"image"`
	Error string `json:"error"`
}

type FetchUsersResult struct {
	Users   []User `json:"users"`
	HasMore bool   `json:"hasMore"`
}

// ################################## BROADCASTS ##############################################

type LoginBroadcast struct {
	User     User   `json:"user"`
	GuildIds string `json:"guildIds"`
}

type LogoutBroadcast struct {
	Username string   `json:"username"`
	GuildIds []string `json:"guildIds"`
}

type UploadLogoBroadcast struct {
	UserId   string   `json:"userId"`
	GuildIds []string `json:"guildIds"`
	Image    string   `json:"image"`
}

type MutedBroadcast struct {
	UserId    string `json:"userId"`
	ChannelId string `json:"channelId"`
	GuildId   string `json:"guildId"`
	IsMuted   bool   `json:"ismuted"`
}

type DeafenBroadcast struct {
	UserId    string `json:"userId"`
	ChannelId string `json:"channelId"`
	GuildId   string `json:"guildId"`
	IsDeafen  bool   `json:"isdeafen"`
}

// #############################################################################################
