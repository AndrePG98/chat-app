import { ChannelDTO } from "./ChannelDTO"
import { UserDTO } from "./UserDTO"

export class GuildDTO {
	id: string
	ownerId: string
	name: string
	channels: ChannelDTO[]
	members: UserDTO[]
	logo: string = ""

	constructor(id: string, name: string, ownderId: string) {
		this.id = id
		this.ownerId = ownderId
		this.members = []
		this.name = name
		this.channels = []
	}

	getName() {
		return this.name
	}

	setName(name: string) {
		this.name = name
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
}
