export class UserDTO {
	id: string
	name: string
	email: string
	guilds: string[] = []
	logo: string

	constructor(id: string, name: string, email: string, logo: string) {
		this.id = id
		this.email = email
		this.name = name
		this.logo = logo
	}

	setGuilds(guilds: string[]) {
		this.guilds.concat(guilds)
	}
}
