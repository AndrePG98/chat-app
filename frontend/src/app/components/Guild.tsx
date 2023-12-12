"use client"

import { createContext, useState } from "react"

import { ChannelDTO } from "../DTOs/ChannelDTO"
import { GuildDTO } from "../DTOs/GuildDTO"
import TextChannel from "./TextChannel"
import ChannelsPanel from "./layouts/ChannelsPanel"
import MembersPanel from "./layouts/MembersPanel"
import VoiceChannel from "./VoiceChannel"

export const SelectedChannelContext = createContext<{
	selectedChannel: ChannelDTO | undefined
	selectChannel: (channelId: string) => void
	createNewChannel: (name: string, type: string) => void
}>({
	selectedChannel: undefined,
	selectChannel: (channelId: string) => {},
	createNewChannel: (name: string, type: string) => {},
})

export default function Guild(props: { guild: GuildDTO }) {
	const [selectedChannel, setSelectedChannel] = useState<ChannelDTO | undefined>(undefined)

	const createNewChannel = (name: string, type: string) => {
		const newChannel = new ChannelDTO(
			(props.guild.getChannels().length + 1).toString(),
			name,
			type
		)
		props.guild.addChannel(newChannel)
		console.log(props.guild.getChannels())
		console.log(props.guild.getChannel("1"))
	}

	const selectChannel = (channelId: string) => {
		setSelectedChannel(props.guild.getChannels().find((channel) => channel.id === channelId))
	}

	return (
		<div className="server flex-1 flex flex-row">
			<SelectedChannelContext.Provider
				value={{ selectedChannel, selectChannel, createNewChannel }}
			>
				<ChannelsPanel
					channels={props.guild.getChannels()}
					guildName={props.guild.name}
				></ChannelsPanel>
			</SelectedChannelContext.Provider>
			<div className="selected-channel-div flex-1">
				{selectedChannel?.type === "text" && (
					<TextChannel channel={selectedChannel}></TextChannel>
				)}
				{selectedChannel?.type === "voice" && (
					<VoiceChannel channel={selectedChannel}></VoiceChannel>
				)}
			</div>
			<MembersPanel />
		</div>
	)
}
