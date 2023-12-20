import { ChannelDTO } from "@/app/DTOs/ChannelDTO"
import { useUserContext } from "@/app/context/UserContext"
import { SendMessageEvent } from "../../../DTOs/MessageDTO"
import ChatPanel from "./ChatPanel"
import { SenderDTO } from "@/app/DTOs/UserDTO"
import { Button } from "@nextui-org/react"

interface TextChannelProps {
	channel: ChannelDTO
	guildId: string
}

export default function TextChannel(props: TextChannelProps) {
	const { sendWebSocketMessage, currentUser } = useUserContext()

	const createNewMessage = (message: string) => {
		const sender = new SenderDTO(
			currentUser.id,
			currentUser.username,
			currentUser.email,
			currentUser.logo
		)
		const msg = new SendMessageEvent(sender, props.guildId, props.channel.channelId, message)
		sendWebSocketMessage(msg)
	}

	return (
		<div className="text-channel h-full">
			<ChatPanel channel={props.channel} createNewMessage={createNewMessage}></ChatPanel>
		</div>
	)
}
