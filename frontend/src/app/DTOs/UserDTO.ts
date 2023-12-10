export class UserDTO {
	id: string
	name: string
	guilds: string[] = []
	logo: string

	constructor(id: string, name: string, logo: string) {
		this.id = id
		this.name = name
		this.logo = logo
	}

	setGuilds(guilds: string[]) {
		this.guilds.concat(guilds)
	}
}
