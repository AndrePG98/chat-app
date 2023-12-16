package models

const (
	E_Register int = iota
	E_Login
	E_Logout
	E_CreateGuild
	E_DeleteGuild
	E_JoinGuild
	E_LeaveGuild
	E_CreateChannel
	E_DeleteChannel
	E_JoinChannel
	E_LeaveChannel
	E_ChatMessage
	E_DeleteMessage
)

const (
	R_Acess int = iota // Equivalent to R_Login & R_Register
	R_GuildJoin
	B_Login
	B_Logout
	B_GuildDelete
	B_GuildJoin
	B_GuildLeave
	B_ChannelCreate
	B_ChannelDelete
	B_JoinChannel
	B_LeaveChannel
	B_ChatMessage
	B_ChatMessageDelete
)
