export class User {
	id: number
	name: string
	guilds: string[]

	constructor(id: number, name: string, guilds: string[]) {
		this.id = id
		this.name = name
		this.guilds = guilds
	}
}
