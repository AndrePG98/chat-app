import { SenderDTO } from './UserDTO'
import { IEvent, ResultType, EventType } from './Types'

export class MessageDTO {
	messageId: string
	sender: SenderDTO
	guildId: string
	channelId: string
	content: string
	sendAt: string

	constructor(
		id: string,
		sender: SenderDTO,
		guildId: string,
		channelId: string,
		content: string,
		sendAt: string
	) {
		this.messageId = id
		this.sender = sender
		this.guildId = guildId
		this.channelId = channelId
		this.content = content
		this.sendAt = sendAt
	}
}

export class SendMessageEvent implements IEvent {
	type: number
	body: any

	constructor(sender: SenderDTO, guildId: string, channelId: string, content: string) {
		this.type = EventType.ChatMessage
		this.body = {
			sender,
			guildId,
			channelId,
			sendAt: new Date(Date.now()).toLocaleDateString('en-GB'),
			content
		}
	}
}

export class DeleteMessageEvent implements IEvent {
	type: number
	body: any

	constructor(userId: string, guildId: string, channelId: string, messageId: string) {
		this.type = EventType.DeleteMessage
		this.body = {
			userId,
			guildId,
			channelId,
			messageId
		}
	}
}

export interface ChatMessageBroadcast {
	type: ResultType
	body: {
		message: MessageDTO
	}
}

export interface DeleteMessageBroadcast {
	type: ResultType
	body: {
		guildId: string
		channelId: string
		messageId: string
	}
}
