import { useState } from "react"
import { GuildDTO } from "../DTOs/GuildDTO"
import { useAuth } from "../context/authContext"

export const useApp = () => {
	const [guild, setGuild] = useState<GuildDTO>()
	const { currentUser } = useAuth()
	const [tempCounter, setTempCounter] = useState(1)

	const createGuild = (name: string) => {
		//TODO fetch id from database in the future
		const guild = new GuildDTO("1", name)
		currentUser.addGuild(guild)
		setTempCounter(tempCounter + 1)
	}

	const selectGuild = (guildId: string) => {
		setGuild(currentUser.getGuild(guildId))
	}

	return { guild, createGuild, selectGuild }
}
