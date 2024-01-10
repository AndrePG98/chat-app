import { ChannelDTO } from "../../../DTOs/ChannelDTO"
import { useUserContext } from "../../../context/UserContext"
import { SendMessageEvent } from "../../../DTOs/MessageDTO"
import ChatPanel from "./ChatPanel"

interface TextChannelProps {
	channel: ChannelDTO
	guildId: string
}

export default function TextChannel(props: TextChannelProps) {
	const { sendWebSocketMessage, currentUser } = useUserContext()

	const createNewMessage = (message: string) => {
		const sender = currentUser.convert()
		const msg = new SendMessageEvent(sender, props.guildId, props.channel.channelId, message)
		sendWebSocketMessage(msg)
	}

	return (
		<div className="text-channel h-full">
			<ChatPanel channel={props.channel} createNewMessage={createNewMessage}></ChatPanel>
		</div>
	)
}
