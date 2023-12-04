package models

/*
Message Types :

1. Text Channel Message - Updates the chat of the specified channel in the specified server.
2. Add User to Voice channel - Updates the ui of the server members
3. Add User to Server - Updates the ui of the server members
Missing - notifications and dm
*/

type Body struct {
	UserID    int    `json:"userID"`
	ServerID  int    `json:"serverID"`
	ChannelID int    `json:"channelID"`
	Message   string `json:"message"`
}

type Data struct {
	Type int  `json:"type"`
	Body Body `json:"body"`
}
