import { useEffect } from "react"
import { ChatMessageRequest } from "../DTOs/RequestsDTOs"
import { useAuth } from "../context/authContext"
import ChatPanel from "./layouts/ChatPanel"
import { MessageDTO } from "../DTOs/MessageDTO"
import { ChannelDTO } from "../DTOs/ChannelDTO"

export default function TextChannel(props: { channel: ChannelDTO; messages: MessageDTO[] }) {
	const { currentUser, sendWebSocketMessage, receivedMessage } = useAuth()

	const createNewMessage = (message: string) => {
		const chatMessage = new ChatMessageRequest(currentUser.id, "1", "1", message)
		sendWebSocketMessage(chatMessage)
	}

	useEffect(() => {
		if (
			receivedMessage.type !== -1 &&
			receivedMessage.body != null &&
			receivedMessage.type === 3
		) {
			const newMessage: string = receivedMessage.body.content
			props.channel.addMessage(currentUser, newMessage)
		}
	}, [receivedMessage])

	return (
		<div className="text-channel h-full flex-1">
			<ChatPanel
				channelId={props.channel.id}
				createNewMessage={createNewMessage}
				messages={props.messages}
			></ChatPanel>
		</div>
	)
}
