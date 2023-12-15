import { ChannelDTO } from "@/app/DTOs/ChannelDTO"
import { useUserContext } from "@/app/context/UserContext"
import { ChatMessageEvent } from "../../../DTOs/Events"
import ChatPanel from "./ChatPanel"

interface TextChannelProps {
	channel: ChannelDTO
	guildId: string
}

export default function TextChannel(props: TextChannelProps) {
	const { sendWebSocketMessage, currentUser } = useUserContext()

	const createNewMessage = (message: string) => {
		const msg = new ChatMessageEvent(currentUser.id, props.guildId, props.channel.id, message)
		sendWebSocketMessage(msg)
	}

	return (
		<div className="text-channel h-full flex-1">
			<ChatPanel
				channelId={props.channel.id}
				createNewMessage={createNewMessage}
				messages={props.channel.messages}
			></ChatPanel>
		</div>
	)
}
