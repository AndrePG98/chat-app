import { UserDTO } from "./UserDTO"

export class MessageDTO {
	id: string
	sender: UserDTO
	body: string

	constructor(id: string, sender: UserDTO, body: string) {
		this.id = id
		this.sender = sender
		this.body = body
	}
}
