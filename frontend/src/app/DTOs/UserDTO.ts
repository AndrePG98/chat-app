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

	joinGuild(guild: GuildDTO) {
		this.guilds.push(guild)
	}

}
