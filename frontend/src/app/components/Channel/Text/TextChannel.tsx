import { useEffect, useState } from "react"
import ChatPanel from "./ChatPanel"
import { ChatMessageRequest } from "../../../DTOs/RequestDTO"
import { ChannelDTO } from "@/app/DTOs/ChannelDTO"
import { useAuth } from "@/app/context/UserContext"
import Message from "./Message"
import { MessageDTO } from "@/app/DTOs/MessageDTO"
import { m } from "framer-motion"

export default function TextChannel(props: { channel: ChannelDTO; guildId: string }) {
	const { sendWebSocketMessage, currentUser, receivedMessage } = useAuth()

	function createNewMessage(message: string) {
		const msg = new ChatMessageRequest(currentUser.id, props.guildId, props.channel.id, message)
		sendWebSocketMessage(msg)
	}

	return (
		<div className="text-channel h-full flex-1">
			{}
			{/* <ChatPanel
				channelId={props.channel.id}
				createNewMessage={createNewMessage}
				messages={props.channel.messages}
			></ChatPanel> */}
		</div>
	)
}
