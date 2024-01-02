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
	State    []Guild `json:"state"`
	Error    string  `json:"error"`
}

type UploadLogoResult struct {
	Image string `json:"image"`
	Error string `json:"error"`
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

// #############################################################################################
