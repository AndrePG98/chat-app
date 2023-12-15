import { MessageDTO } from "./MessageDTO";
import { EventType, IEvent, ResultType } from "./Types";
import { SenderDTO } from "./UserDTO";

export class ChannelDTO {
    channelId: string
    guildId: string
    channelName: string
    channelType: string
    members: SenderDTO[]
    history: MessageDTO[]

    constructor(id: string,
        guildId: string,
        name: string,
        type: string,
        members: SenderDTO[],
        history: MessageDTO[]
    ) {
        this.channelId = id
        this.guildId = guildId
        this.channelName = name
        this.channelType = type
        this.members = members
        this.history = history
    }

    addMessage(message: MessageDTO) {
        this.history.push(message)
    }
}


export class CreateChannelEvent implements IEvent {
    type: EventType
    body: any

    constructor(userId: string, guildId: string, channelName: string, channelType: string) {
        this.type = EventType.CreateChannel
        this.body = { userId, guildId, channelName, channelType }
    }
}


export class DeleteChannelEvent implements IEvent {
    type: EventType
    body: any

    constructor(userId: string, guildId: string, channelId: string) {
        this.type = EventType.CreateChannel
        this.body = { userId, guildId, channelId }
    }
}

export class JoinChannelEvent implements IEvent {
    type: EventType
    body: any

    constructor(userId: string, guildId: string, channelId: string) {
        this.type = EventType.CreateChannel
        this.body = { userId, guildId, channelId }
    }
}

export class LeaveChannelEvent implements IEvent {
    type: EventType
    body: any

    constructor(userId: string, guildId: string, channelId: string) {
        this.type = EventType.CreateChannel
        this.body = { userId, guildId, channelId }
    }
}

export interface CreateChannelBroadcast {
    type: ResultType
    body: {
        guildId: string
        channelId: string
        channelName: string
        channelType: string
    }
}
