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
	Avatar   []byte `json:"avatar"`
}

type LoginEvent struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Token    string `json:"token"`
}

type LogoutEvent struct{}

// ################################## EVENTS ###########################################

// ################################## RESULTS ##############################################

// Response for both Register and Login events. Sends empty state if registering
type AcessResult struct {
	Result   bool    `json:"result"`
	Token    string  `json:"token"`
	UserId   string  `json:"userId"`
	Username string  `json:"username"`
	State    []Guild `json:"state"`
	Error    string  `json:"error"`
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

// #############################################################################################
