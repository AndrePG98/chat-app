"use client"

import { useState } from "react"

import { ChannelDTO, CreateChannelEvent } from "../../DTOs/ChannelDTO"
import { GuildDTO, LeaveGuildEvent } from "../../DTOs/GuildDTO"
import ChannelSelector from "../Channel/ChannelSelector"
import TextChannel from "../Channel/Text/TextChannel"
import VoiceChannel from "../Channel/Voice/VoiceChannel"
import MembersPanel from "./MembersPanel"
import { useUserContext } from "@/app/context/UserContext"

export default function Guild(props: { guild: GuildDTO }) {
	const { currentUser, sendWebSocketMessage } = useUserContext()
	const [selectedChannel, setSelectedChannel] = useState<ChannelDTO>()

	const selectChannel = (channel: ChannelDTO) => {
		setSelectedChannel(channel)
	}

	const createNewChannel = (name: string, type: string) => {
		const channel = new CreateChannelEvent(currentUser.id, props.guild.guildId, name, type)
		sendWebSocketMessage(channel)
	}

	return (
		<div className="server flex-1 flex flex-row w-full justify-between">
			<ChannelSelector
				channels={props.guild.channels}
				createNewChannel={createNewChannel}
				selectChannel={selectChannel}
				serverName={props.guild.guildName}
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
