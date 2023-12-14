"use client"

import { GuildDTO } from "@/app/DTOs/GuildDTO"
import { UserDTO } from "@/app/DTOs/UserDTO"
import { useState } from "react"
import Guild from "./Guild"
import GuildSelector from "./GuildSelector"

export default function GuildsPanel(props: {
	currentUser: UserDTO
	createNewGuild: (guildName: string) => void
}) {
	const [selectedGuild, setSelectedGuild] = useState<GuildDTO>()

	const selectGuild = (guild: GuildDTO) => {
		setSelectedGuild(guild)
	}

	return (
		<div className="flex h-screen flex-row">
			<GuildSelector
				currentUser={props.currentUser}
				selectGuild={selectGuild}
				createNewGuild={props.createNewGuild}
			/>
			{selectedGuild && <Guild guild={selectedGuild} />}
		</div>
	)
}
