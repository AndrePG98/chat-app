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
	E_JoinNewChannel
	E_LeaveChannel
	E_ChatMessage
	E_DeleteMessage
	E_UploadLogo
	E_Mute
	E_Deafen
	E_FetchUsers
	E_Invite
)

const (
	R_Acess int = iota // Equivalent to R_Login & R_Register
	R_GuildJoin
	R_GuildLeave
	R_UploadLogo
	R_FetchUsers
	R_Invitation
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
	B_UploadLogo
	B_Mute
	B_Deafen
)
