import { ChannelDTO } from "./ChannelDTO"
import { GuildDTO } from "./GuildDTO"
import { IEvent, EventType, ResultType } from "./Types"

export class UserDTO {
	id: string
	username: string
	email: string
	guilds: GuildDTO[] = []
	logo: string
	currentChannel: ChannelDTO | undefined

	constructor(id: string, username: string, email: string, logo: string) {
		this.id = id
		this.email = email
		this.username = username
		this.logo = logo
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
		return new SenderDTO(this.id, this.username, this.email, this.logo)
	}
}

export class SenderDTO {
	userId: string
	username: string
	email: string
	logo: string

	constructor(userId: string, username: string, email: string, logo: string) {
		this.userId = userId
		this.username = username
		this.email = email
		this.logo = logo
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
	type: EventType;
	body: any

	constructor(userId: string) {
		this.type = EventType.Logout
		this.body = { userId }
	}
}

export class UploadLogoEvent implements IEvent {
	type: EventType;
	body: any

	constructor(image: string, userId: string) {
		this.type = EventType.UploadLogo
		this.body = { image, userId }
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
		state: GuildDTO[]
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
