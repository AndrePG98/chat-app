export class User {
	id: string
	name: string
	guilds: string[]
	logo: string

	constructor(id: string, name: string, guilds: string[], logo: string) {
		this.id = id
		this.name = name
		this.guilds = guilds
		this.logo = logo
	}
}
