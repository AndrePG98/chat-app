import { GuildDTO } from "./GuildDTO"

export class UserDTO {
	id: string
	name: string
	guilds: GuildDTO[] = []
	logo: string

	constructor(id: string, name: string, logo: string) {
		this.id = id
		this.name = name
		this.logo = logo
	}

	addGuild(guild: GuildDTO) {
		this.guilds.push(guild)
	}

	getGuilds() {
		return this.guilds
	}

	getGuild(id: string) {
		return this.guilds.find((guild) => guild.id === id)
	}

	/* 	setGuilds(guilds: string[]) {
		this.guilds.concat(guilds)
	} */
}
