
export interface IEvent {
    type: number
    body: any
}

export enum EventType {
    Register,
    Login,
    Logout,
    CreateGuild,
    DeleteGuild,
    JoinGuild,
    LeaveGuild,
    CreateChannel,
    DeleteChannel,
    JoinChannel,
    JoinNewChannel,
    LeaveChannel,
    ChatMessage,
    DeleteMessage,
    UploadLogo,
}

export enum ResultType {
    R_Acess,
    R_JoinGuild,
    R_LeaveGuild,
    R_UploadLogo,
    B_Login,
    B_Logout,
    B_GuildDelete,
    B_GuildJoin,
    B_GuildLeave,
    B_CreateChannel,
    B_DeleteChannel,
    B_JoinChannel,
    B_LeaveChannel,
    B_ChatMessage,
    B_ChatMessageDelete,
    B_UploadLogo
}
