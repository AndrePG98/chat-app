import { MessageDTO } from "./MessageDTO"
import { UserDTO } from "./UserDTO"

export class ChannelDTO {
	id: number
	name: string
	type: string
	messages: MessageDTO[] = []

	constructor(id: number, name: string, type: string) {
		this.id = id
		this.name = name
		this.type = type
	}

	getMessages() {
		return this.messages
	}

	addMessage(sender: UserDTO, message: string) {
		const newMessage = new MessageDTO(
			(this.getMessages().length + 1).toString(),
			sender,
			message
		)
		this.messages.push(newMessage)
	}
}
