"use client"

import { useEffect, useState } from "react"

import { ChannelDTO, CreateChannelEvent, DeleteChannelEvent } from "../../DTOs/ChannelDTO"
import { GuildDTO, LeaveGuildEvent } from "../../DTOs/GuildDTO"
import ChannelSelector from "../Channel/ChannelSelector"
import TextChannel from "../Channel/Text/TextChannel"
import VoiceChannel from "../Channel/Voice/voiceChannel"
import MembersPanel from "./MembersPanel"
import { useUserContext } from "@/app/context/UserContext"
import { Divider } from "@nextui-org/react"
import { SenderDTO } from "@/app/DTOs/UserDTO"

export default function Guild(props: { guild: GuildDTO; leaveGuild: (guildId: string) => void }) {
	const { currentUser, sendWebSocketMessage } = useUserContext()
	const [selectedChannel, setSelectedChannel] = useState<ChannelDTO | undefined>()

	const selectChannel = (channel: ChannelDTO | undefined) => {
		setSelectedChannel(channel)
	}

	const createNewChannel = (name: string, type: string) => {
		const event = new CreateChannelEvent(currentUser.id, props.guild.guildId, name, type)
		sendWebSocketMessage(event)
	}

	const deleteChannel = (channelId: string) => {
		if (selectedChannel?.channelId === channelId) {
			setSelectedChannel(undefined)
		}
		const event = new DeleteChannelEvent(currentUser.id, props.guild.guildId, channelId)
		sendWebSocketMessage(event)
	}

	useEffect(() => {
		selectChannel(props.guild.channels[0])
	}, [props.guild])

	return (
		<div className="server flex-1 flex flex-row w-full justify-between">
			<ChannelSelector
				channels={props.guild.channels}
				createNewChannel={createNewChannel}
				selectChannel={selectChannel}
				deleteChannel={deleteChannel}
				serverName={props.guild.guildName}
				leaveGuild={() => props.leaveGuild(props.guild.guildId)}
			></ChannelSelector>
			<div className="selected-channel-div basis-[75%] grow-0 shrink-1">
				{selectedChannel?.channelType === "text" && (
					<TextChannel
						channel={selectedChannel}
						guildId={props.guild.guildId}
					></TextChannel>
				)}
				{selectedChannel?.channelType === "voice" && (
					<VoiceChannel channnel={selectedChannel}></VoiceChannel>
				)}
			</div>
			<MembersPanel members={props.guild.members} />
		</div>
	)
}
