import { channel } from "diagnostics_channel"
import { ChannelDTO } from "../DTOs/ChannelDTO"
import { ChatMessageRequest } from "../DTOs/RequestsDTOs"
import { useAuth } from "../context/authContext"
import ChatPanel from "./layouts/ChatPanel"

export default function TextChannel(props: { channel: ChannelDTO }) {
	const { currentUser, sendWebSocketMessage, receivedMessage } = useAuth()

	const createNewMessage = (message: string) => {
		const chatMessage = new ChatMessageRequest(currentUser.id, "1", "1", message)
		sendWebSocketMessage(chatMessage)
		props.channel.addMessage(currentUser, message)
	}

	/* 	useEffect(() => {
		if (
			receivedMessage.type !== -1 &&
			receivedMessage.body != null &&
			receivedMessage.type === 3
		) {
		}
	}, [props.channel.getMessages()]) */

	return (
		<div key={props.channel.id}>
			<ChatPanel
				// messages={props.channel.getMessages()}
				createNewMessage={createNewMessage}
				channel={props.channel}
			></ChatPanel>
		</div>
	)
}
