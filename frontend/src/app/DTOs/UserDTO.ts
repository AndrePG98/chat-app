import { GuildDTO } from "./GuildDTO"

export class UserDTO {
	id: string
	username: string
	email: string
	guilds: GuildDTO[] = []
	logo: string

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

	addGuild(guildName: string) {
		const newGuild = new GuildDTO((this.getGuilds.length + 1).toString(), guildName)
		this.guilds.push(newGuild)
	}

	getGuilds() {
		return this.guilds
	}

	getGuild(name: string) {
		return this.guilds.find((guild) => guild.getName() === name)
	}

	joinGuild(guild: GuildDTO) {
		this.guilds.push(guild)
	}
}
