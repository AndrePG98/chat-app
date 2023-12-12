import { MessageDTO } from "./MessageDTO";

export class ChannelDTO {
    id: string;
    name: string;
    type: string;
    messages: MessageDTO[] = []

    constructor(id: string, name: string, type: string) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    addMessage(message: MessageDTO) {
        this.messages.push(message)
    }
}
