"use client"

import { GuildDTO, LeaveGuildEvent } from "@/app/DTOs/GuildDTO"
import { UserDTO } from "@/app/DTOs/UserDTO"
import { useState } from "react"
import Guild from "./Guild"
import GuildSelector from "./GuildSelector"
import { useUserContext } from "@/app/context/UserContext"

export default function GuildsPanel(props: {
	currentUser: UserDTO
	createNewGuild: (guildName: string) => void
}) {
	const { sendWebSocketMessage, currentUser } = useUserContext()
	const [selectedGuild, setSelectedGuild] = useState<GuildDTO>()

	const selectGuild = (guild: GuildDTO) => {
		setSelectedGuild(guild)
	}

	const leaveGuild = (guildId: string) => {
		const event = new LeaveGuildEvent(guildId, currentUser.id)
		sendWebSocketMessage(event)
		if (selectedGuild && selectedGuild.guildId === guildId) {
			setSelectedGuild(undefined)
		}
	}

	return (
		<div className="flex h-screen flex-row">
			<GuildSelector
				currentUser={props.currentUser}
				selectGuild={selectGuild}
				createNewGuild={props.createNewGuild}
				leaveGuild={leaveGuild}
			/>
			{selectedGuild && <Guild guild={selectedGuild} />}
		</div>
	)
}
