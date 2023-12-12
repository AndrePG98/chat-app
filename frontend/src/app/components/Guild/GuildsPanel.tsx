"use client"

import { GuildDTO } from "@/app/DTOs/GuildDTO"
import { useState } from "react"
import GuildSelector from "./GuildSelector"
import Guild from "./Guild"
import { UserDTO } from "@/app/DTOs/UserDTO"

export default function GuildsPanel(props: { currentUser: UserDTO }) {
	const [selectedGuild, setSelectedGuild] = useState<GuildDTO>()

	const selectGuild = (guild: GuildDTO) => {
		setSelectedGuild(guild)
	}

	return (
		<div className="flex h-screen flex-row">
			<GuildSelector guilds={props.currentUser.guilds} selectGuild={selectGuild} />
			{selectedGuild && <Guild guild={selectedGuild} />}
		</div>
	)
}
