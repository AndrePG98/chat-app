export class MessageDTO {
	id: string
	guildId: string
	channelId: string
	senderId: string
	body: string

	constructor(id: string, guildId: string, channelId: string, senderId: string, body: string) {
		this.id = id
		this.guildId = guildId
		this.channelId = channelId
		this.senderId = senderId
		this.body = body
	}
}
