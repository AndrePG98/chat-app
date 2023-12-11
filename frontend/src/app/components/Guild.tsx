"use client"

import { createContext, useState } from "react"

import { ChannelDTO } from "../DTOs/ChannelDTO"
import TextChannel from "./TextChannel"
import VoiceChannel from "./VoiceChannel"
import ChannelsPanel from "./layouts/ChannelsPanel"
import MembersPanel from "./layouts/MembersPanel"

export const SelectedChannelContext = createContext<{
	selectedChannel: ChannelDTO | undefined
	selectChannel: (channelId: number) => void
	createNewChannel: (name: string, type: string) => void
}>({
	selectedChannel: undefined,
	selectChannel: (channelId: number) => {},
	createNewChannel: (name: string, type: string) => {},
})

export default function Guild() {
	const [channels, setChannels] = useState<ChannelDTO[]>([])
	const [selectedChannel, setSelectedChannel] = useState<ChannelDTO | undefined>(undefined)

	const createNewChannel = (name: string, type: string) => {
		const newChannel = new ChannelDTO(channels.length + 1, name, type)
		setChannels((prevChannels) => [...prevChannels, newChannel])
	}

	const selectChannel = (channelId: number) => {
		setSelectedChannel(channels.find((channel) => channel.id === channelId))
	}

	return (
		<div className="server flex-1 flex flex-row">
			<SelectedChannelContext.Provider
				value={{ selectedChannel, selectChannel, createNewChannel }}
			>
				<ChannelsPanel channels={channels}></ChannelsPanel>
			</SelectedChannelContext.Provider>
			<div className="selected-channel-div flex-1">
				{selectedChannel?.type === "text" && (
					<TextChannel
						channelName={selectedChannel.name}
						channelId={selectedChannel.id}
					></TextChannel>
				)}
				{selectedChannel?.type === "voice" && (
					<VoiceChannel
						channelName={selectedChannel.name}
						channelId={selectedChannel.id}
					></VoiceChannel>
				)}
			</div>
			<MembersPanel />
		</div>
	)
}
