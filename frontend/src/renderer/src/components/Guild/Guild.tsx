"use client"

import { useEffect, useState } from "react"

import { ChannelDTO, CreateChannelEvent, DeleteChannelEvent } from "../../DTOs/ChannelDTO"
import { GuildDTO } from "../../DTOs/GuildDTO"
import ChannelSelector from "../Channel/ChannelSelector"
import TextChannel from "../Channel/Text/TextChannel"
import MembersPanel from "./MembersPanel"
import { useUserContext } from "../../context/UserContext"

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
		const chan = props.guild.channels.find((chan) => chan.channelType === "text")
		if (chan) {
			setSelectedChannel(chan)
		} else {
			setSelectedChannel(undefined)
		}
		props.guild.channels.forEach((chan) => {
			if (chan.channelType === "voice") {
				let user = chan.members.find((user) => {
					if (user.userId === currentUser.id) {
						return user
					}
				})
				if (user) {
					currentUser.currentChannel = chan
				}
			}
		})
	}, [props.guild])

	return (
		<div className="server flex-1 flex flex-row w-full justify-between">
			<ChannelSelector
				channels={props.guild.channels}
				createNewChannel={createNewChannel}
				selectChannel={selectChannel}
				deleteChannel={deleteChannel}
				guild={props.guild}
				leaveGuild={() => props.leaveGuild(props.guild.guildId)}
			></ChannelSelector>
			<div className="selected-channel-div basis-[75%] grow-0 shrink-1">
				{selectedChannel?.channelType === "text" && (
					<TextChannel
						channel={selectedChannel}
						guildId={props.guild.guildId}
					></TextChannel>
				)}
			</div>
			<MembersPanel members={props.guild.members} />
		</div>
	)
}
