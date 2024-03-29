import { MessageDTO } from './MessageDTO'
import { EventType, IEvent, ResultType } from './Types'
import { SenderDTO } from './UserDTO'

export class ChannelDTO {
	channelId: string
	guildId: string
	channelName: string
	channelType: string
	members: SenderDTO[]
	history: MessageDTO[]

	constructor(
		id: string,
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

	joinChannel(user: SenderDTO) {
		if (this.channelType === 'voice') {
			this.members.push(user)
		}
	}

	leaveChannel(userId: string) {
		this.members = this.members.filter((member) => {
			return member.userId != userId
		})
	}

	hasMember(userId: string) {
		let member = this.members.find((user) => {
			return user.userId === userId
		})
		if (member) {
			return true
		}
		return false
	}

	addMessage(message: MessageDTO) {
		this.history.push(message)
	}

	removeMessage(messageId: string) {
		this.history = this.history.filter((msg) => {
			return msg.messageId !== messageId
		})
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
		this.type = EventType.DeleteChannel
		this.body = { userId, guildId, channelId }
	}
}

export class JoinChannelEvent implements IEvent {
	type: EventType
	body: any

	constructor(user: SenderDTO, guildId: string, channelId: string) {
		this.type = EventType.JoinChannel
		this.body = { user, guildId, channelId }
	}
}

export class JoinNewChannelEvent implements IEvent {
	type: EventType
	body: any

	constructor(user: SenderDTO, prevChannel: ChannelDTO, newChannel: ChannelDTO) {
		this.type = EventType.JoinNewChannel
		this.body = { user, prevChannel, newChannel }
	}
}

export class LeaveChannelEvent implements IEvent {
	type: EventType
	body: any

	constructor(userId: string, guildId: string, channelId: string) {
		this.type = EventType.LeaveChannel
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

export interface DeleteChannelBroadcast {
	type: ResultType
	body: {
		guildId: string
		channelId: string
	}
}

export interface JoinChannelBroadcast {
	type: ResultType
	body: {
		guildId: string
		channelId: string
		user: SenderDTO
	}
}

export interface JoinNewChannelBroadcast {
	type: ResultType
	body: {
		user: SenderDTO
		prevChannel: ChannelDTO
		newChannel: ChannelDTO
	}
}

export interface SdpAnswerResult {
	type: ResultType
	body: {
		user: SenderDTO
		guildId: string
		channelId: string
		answer: string
	}
}

export interface LeaveCHannelBroadcast {
	type: ResultType
	body: {
		guildId: string
		channelId: string
		userId: string
	}
}
