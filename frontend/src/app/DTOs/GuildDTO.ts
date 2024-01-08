import { ChannelDTO } from "./ChannelDTO"
import { SenderDTO, UserDTO } from "./UserDTO"
import { IEvent, EventType, ResultType } from "./Types"

export class GuildDTO {
	guildId: string
	ownerId: string
	guildName: string
	channels: ChannelDTO[]
	members: SenderDTO[]
	logo: string = ""

	constructor(guildId: string, name: string, ownerId: string) {
		this.guildId = guildId
		this.ownerId = ownerId
		this.members = []
		this.guildName = name
		this.channels = []
	}

	getName() {
		return this.guildName
	}

	setName(name: string) {
		this.guildName = name
	}

	getChannel(channelId: string) {
		return this.channels.find((chann) => chann.channelId === channelId)
	}

	getChannels() {
		return this.channels
	}

	setChannels(channels: ChannelDTO[]) {
		this.channels.concat(channels)
	}

	addChannel(channel: ChannelDTO) {
		this.channels.push(channel)
	}

	setLogo(logo: string) {
		this.logo = logo
	}

	addMember(member: SenderDTO) {
		this.members.push(member)
	}

	removeMember(memberId: string) {
		this.members = this.members.filter((member) => {
			return member.userId !== memberId
		})
	}
}


export class CreateGuildEvent implements IEvent {
	type: EventType
	body: any

	constructor(ownerId: string, guildName: string) {
		this.type = EventType.CreateGuild
		this.body = { ownerId, guildName }
	}
}

export class DeleteGuildEvent implements IEvent {
	type: EventType
	body: any

	constructor(userId: string, guildId: string) {
		this.type = EventType.DeleteGuild
		this.body = { userId, guildId }
	}
}

export class JoinGuildEvent implements IEvent {
	type: EventType
	body: any

	constructor(guildId: string, member: SenderDTO, inviteId: string) {
		this.type = EventType.JoinGuild
		this.body = { inviteId, guildId, member }
	}
}

export class LeaveGuildEvent implements IEvent {
	type: EventType
	body: any

	constructor(guildId: string, memberId: string) {
		this.type = EventType.LeaveGuild
		this.body = { guildId, memberId }
	}
}


export interface JoinGuildResult {
	type: ResultType
	body: {
		guild: GuildDTO
	}
}

export interface LeaveGuildResult {
	type: ResultType
	body: {
		guildId: string
	}
}

export interface GuildDeleteBroadcast {
	type: ResultType
	body: {
		guildId: string
	}
}


export interface JoinGuildBroadcast {
	type: ResultType
	body: {
		user: SenderDTO
		guildId: string
	}
}

export interface LeaveGuildBroadcast {
	type: ResultType
	body: {
		userId: string
		guildId: string
	}
}
