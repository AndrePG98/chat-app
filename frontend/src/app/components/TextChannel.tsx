import { useEffect, useState } from "react"
import { useAuth } from "../context/authContext"
import ChatPanel from "./layouts/ChatPanel"
import { ChatMessageRequest } from "../DTOs/MessageDTOs";

export default function TextChannel(props: { channelName: string; channelId: number }) {
	const { currentUser, sendWebSocketMessage, receivedMessage } = useAuth()
	const [messages, setMessages] = useState<string[]>([])

	function createNewMessage(message: string) {
		const chatMessage = new ChatMessageRequest(currentUser.id, "1", "1", message)
		sendWebSocketMessage(chatMessage)
	}

	useEffect(() => {
		if (receivedMessage.type !== -1 && receivedMessage.body != null && receivedMessage.type === 3) {
			const newMessage : string = receivedMessage.body.content
			setMessages((prevMessages) => [...prevMessages, newMessage])
		}
	}, [receivedMessage])

	return (
		<div className="text-channel h-full flex-1">
			<ChatPanel
				channelId={props.channelId}
				createNewMessage={createNewMessage}
				messages={messages}
			></ChatPanel>
		</div>
	)
}
