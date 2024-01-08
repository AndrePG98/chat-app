import { ChannelDTO } from "./ChannelDTO"
import { GuildDTO } from "./GuildDTO"
import { IEvent, EventType, ResultType } from "./Types"

export class UserDTO {
	id: string
	username: string
	email: string
	guilds: GuildDTO[] = []
	logo: string
	ismuted: boolean
	isdeafen: boolean
	currentChannel: ChannelDTO | undefined
	selectedGuild: GuildDTO | undefined
	peerConnection: RTCPeerConnection | undefined
	invites: Invite[]

	constructor(id: string, username: string, email: string, logo: string, ismuted: boolean, isdeafen: boolean) {
		this.id = id
		this.email = email
		this.username = username
		this.logo = logo
		this.ismuted = ismuted
		this.isdeafen = isdeafen
		this.invites = []
	}

	getName() {
		return this.username
	}

	setName(username: string) {
		this.username = username
	}

	getLogo() {
		return this.logo
	}

	getGuilds() {
		return this.guilds
	}

	getGuild(guildId: string) {
		return this.guilds.find((guild) => guild.guildId === guildId)
	}

	joinGuild(guild: GuildDTO) {
		this.guilds.push(guild)
	}

	joinGuilds(guilds: GuildDTO[]) {
		guilds.forEach(guild => this.guilds.push(guild))
	}

	leaveGuild(guildId: string) {
		this.guilds = this.guilds.filter((guild) => {
			if (guild.guildId !== guildId) {
				return true
			}
		})
	}

	joinChannel(chan: ChannelDTO) {
		this.currentChannel = chan
	}

	leaveChannel() {
		this.currentChannel = undefined
	}

	convert() {
		return new SenderDTO(this.id, this.username, this.email, this.logo, this.ismuted, this.isdeafen)
	}
}

export class Invite {
	id: string
	sender: SenderDTO
	receiverId: string
	guildId: string
	guildName: string
	sendAt: string

	constructor(id: string, sender: SenderDTO, receiverId: string, guildId: string, guildName: string, sendAt: string) {
		this.id = id
		this.sender = sender
		this.receiverId = receiverId
		this.guildId = guildId
		this.guildName = guildName
		this.sendAt = sendAt
	}
}

export class SenderDTO {
	userId: string
	username: string
	email: string
	logo: string
	ismuted: boolean
	isdeafen: boolean

	constructor(userId: string, username: string, email: string, logo: string, ismuted: boolean, isdeafen: boolean) {
		this.userId = userId
		this.username = username
		this.email = email
		this.logo = logo
		this.ismuted = ismuted
		this.isdeafen = isdeafen
	}
}



export class RegisterEvent implements IEvent {
	type: EventType
	body: any

	constructor(username: string, password: string, email: string) {
		this.type = EventType.Register
		this.body = { username, password, email }
	}
}

export class LoginEvent implements IEvent {
	type: EventType
	body: any

	constructor(username: string, password: string, token: string) {
		this.type = EventType.Login
		this.body = { username, password, token }
	}
}

export class LogoutEvent implements IEvent {
	type: EventType
	body: any

	constructor(userId: string) {
		this.type = EventType.Logout
		this.body = { userId }
	}
}

export class UploadLogoEvent implements IEvent {
	type: EventType
	body: any

	constructor(image: string, userId: string) {
		this.type = EventType.UploadLogo
		this.body = { image, userId }
	}
}

export class MuteEvent implements IEvent {
	type: EventType
	body: any

	constructor(userId: string, channelId: string, guildId: string) {
		this.type = EventType.Mute
		this.body = { userId, channelId, guildId }
	}
}

export class DeafenEvent implements IEvent {
	type: EventType
	body: any
	constructor(userId: string, channelId: string, guildId: string) {
		this.type = EventType.Deafen
		this.body = { userId, channelId, guildId }
	}
}

export class FetchUsersEvent implements IEvent {
	type: EventType
	body: any
	constructor(searchTerm: string, offset: number, limit: number) {
		this.type = EventType.FetchUsers
		this.body = { searchTerm, offset, limit }
	}
}

export class InviteEvent implements IEvent {
	type: EventType
	body: any
	constructor(sender: SenderDTO, receiverId: string, guildId: string, guildName: string) {
		this.type = EventType.Invite
		const sendAt = new Date(Date.now()).toLocaleDateString("en-GB")
		this.body = { sender, receiverId, guildId, guildName, sendAt, }
	}
}

export interface AccessResult {
	type: ResultType
	body: {
		result: boolean
		token: string
		userId: string
		username: string
		email: string
		logo: string
		ismuted: boolean
		isdeafen: boolean
		state: GuildDTO[]
		invites: Invite[]
		error: string
	}
}

export interface UploadLogoResult {
	type: ResultType
	body: {
		image: string
		error: string
	}
}

export interface FetchUsersResult {
	type: ResultType
	body: {
		users: SenderDTO[]
		hasMore: boolean
	}
}

export interface InvitationResult {
	type: ResultType
	body: {
		invite: Invite
	}
}

export interface LoginBroadcast {
	type: ResultType
	body: {
		user: SenderDTO
		guildIds: string[]
	}
}

export interface LogoutBroadcast {
	type: ResultType
	body: {
		username: string
		guildIds: string[]
	}
}

export interface UploadLogoBroadcast {
	type: ResultType
	body: {
		userId: string
		guildIds: string[]
		image: string
	}
}

export interface MuteBroadcast {
	type: ResultType
	body: {
		userId: string
		channelId: string
		guildId: string
		ismuted: boolean
	}
}

export interface DeafenBroadcast {
	type: ResultType
	body: {
		userId: string
		channelId: string
		guildId: string
		isdeafen: boolean
	}
}
