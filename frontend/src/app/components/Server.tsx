"use client"

import { createContext, useState } from "react"

import { ChannelDTO } from "../DTOs/ChannelDTO"
import { ServerDTO } from "../DTOs/ServerDTO"
import TextChannel from "./TextChannel"
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

export default function Server(props: { serverId: string | undefined; server: ServerDTO }) {
	const [selectedChannel, setSelectedChannel] = useState<ChannelDTO | undefined>(undefined)

	const createNewChannel = (name: string, type: string) => {
		const newChannel = new ChannelDTO(props.server.getChannels().length + 1, name, type)
		props.server.addChannel(newChannel)
	}

	const selectChannel = (channelId: number) => {
		setSelectedChannel(props.server.getChannels().find((channel) => channel.id === channelId))
	}

	return (
		<div className="server flex-1 flex flex-row">
			<SelectedChannelContext.Provider
				value={{ selectedChannel, selectChannel, createNewChannel }}
			>
				<ChannelsPanel channels={props.server.getChannels()}></ChannelsPanel>
			</SelectedChannelContext.Provider>
			<div className="selected-channel-div flex-1">
				{props.server.getChannels().map((channel) => (
					<div key={channel.id}>
						<TextChannel
							channel={channel}
							messages={channel.getMessages()}
						></TextChannel>
					</div>
				))}
			</div>
			<MembersPanel />
		</div>
	)
}
