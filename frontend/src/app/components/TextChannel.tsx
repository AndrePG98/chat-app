import { useEffect, useState } from "react"
import { useAuth } from "../context/authContext"
import { ChatMessage } from "../services/WebSocketService"
import ChatPanel from "./layouts/ChatPanel"

export default function TextChannel(props: { channelName: string; channelId: number }) {
	const { currentUser, sendWebSocketMessage, receivedMessage } = useAuth()
	const [messages, setMessages] = useState<string[]>([])

	function createNewMessage(message: string) {
		const jsonMessage = {
			type: 1,
			body: {
				userId: currentUser.id,
				guildId: currentUser.guilds[0],
				channelId: "1",
				message: message,
			} as ChatMessage,
		}

		sendWebSocketMessage(jsonMessage)
	}

	useEffect(() => {
		console.log(receivedMessage)
		if (receivedMessage.type !== -1 && receivedMessage.body != null) {
			var body = receivedMessage.body as ChatMessage
			if (receivedMessage.type === 1) {
				setMessages((prevMessages) => [...prevMessages, body.message])
			}
		}
	}, [receivedMessage])

	return (
		<div className="text-channel h-full flex-1">
			{/* <div className="flex flex-row">
                <Button onPress={() => { sendWebSocketMessage("Test") }}>Send</Button>
                <textarea className="text-xl" value={receivedMessage.type + receivedMessage.payload} readOnly></textarea>
            </div> */}
			<ChatPanel
				channelId={props.channelId}
				createNewMessage={createNewMessage}
				messages={messages}
			></ChatPanel>
		</div>
	)
}
