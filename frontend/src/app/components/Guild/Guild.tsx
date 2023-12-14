"use client"

import { useState } from "react"

import { ChannelDTO } from "../../DTOs/ChannelDTO"
import { GuildDTO } from "../../DTOs/GuildDTO"
import ChannelSelector from "../Channel/ChannelSelector"
import TextChannel from "../Channel/Text/TextChannel"
import VoiceChannel from "../Channel/Voice/VoiceChannel"
import MembersPanel from "./MembersPanel"

export default function Guild(props: { guild: GuildDTO }) {
	const [selectedChannel, setSelectedChannel] = useState<ChannelDTO>()

	const selectChannel = (channel: ChannelDTO) => {
		setSelectedChannel(channel)
	}

	const createNewChannel = (name: string, type: string) => {
		const newChannel = new ChannelDTO(
			(props.guild.getChannels().length + 1).toString(),
			name,
			type
		)
		props.guild.addChannel(newChannel)
	}

	return (
		<div className="server flex-1 flex flex-row">
			<ChannelSelector
				channels={props.guild.channels}
				createNewChannel={createNewChannel}
				selectChannel={selectChannel}
				serverName={props.guild.getName()}
			></ChannelSelector>
			<div className="selected-channel-div flex-1">
				{selectedChannel?.type === "text" && (
					<TextChannel channel={selectedChannel} guildId={props.guild.id}></TextChannel>
				)}
				{selectedChannel?.type === "voice" && (
					<VoiceChannel channnel={selectedChannel}></VoiceChannel>
				)}
			</div>
			<MembersPanel members={props.guild.members} />
		</div>
	)
}
