"use client"

import { DeleteGuildEvent, GuildDTO, LeaveGuildEvent } from "@/app/DTOs/GuildDTO"
import { UserDTO } from "@/app/DTOs/UserDTO"
import { useEffect, useState } from "react"
import Guild from "./Guild"
import GuildSelector from "./GuildSelector"
import { useUserContext } from "@/app/context/UserContext"

export default function GuildsPanel(props: { currentUser: UserDTO }) {
	const { sendWebSocketMessage, currentUser } = useUserContext()
	const [selectedGuild, setSelectedGuild] = useState<GuildDTO>()

	useEffect(() => {
		if (!currentUser.selectedGuild) {
			setSelectedGuild(undefined)
		}
	}, [currentUser.selectedGuild])

	const selectGuild = (guild: GuildDTO) => {
		currentUser.selectedGuild = guild
		setSelectedGuild(guild)
	}

	const leaveGuild = (guildId: string) => {
		if (currentUser.id === selectedGuild?.ownerId) {
			const event = new DeleteGuildEvent(currentUser.id, selectedGuild.guildId)
			sendWebSocketMessage(event)
		} else {
			const event = new LeaveGuildEvent(guildId, currentUser.id)
			sendWebSocketMessage(event)
		}
		if (selectedGuild && selectedGuild.guildId === guildId) {
			setSelectedGuild(undefined)
		}
	}

	return (
		<div className="flex flex-row h-screen w-screen">
			<GuildSelector
				currentUser={props.currentUser}
				selectGuild={selectGuild}
				selectedGuildId={selectedGuild?.guildId}
			/>
			{selectedGuild && <Guild guild={selectedGuild} leaveGuild={leaveGuild} />}
		</div>
	)
}
