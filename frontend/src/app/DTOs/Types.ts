
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
    LeaveChannel,
    ChatMessage,
    DeleteMessage,
}

export enum ResultType {
    R_Acess,
    R_JoinGuild,
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
    B_ChatMessageDelete
}
