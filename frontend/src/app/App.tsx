"use client"

import { CreateGuildEvent, GuildDTO } from "./DTOs/GuildDTO"
import GuildsPanel from "./components/Guild/GuildsPanel"
import RegisterLoginOption from "./components/User/RegisterLoginOption"
import { useUserContext } from "./context/UserContext"

export default function App() {
	const { isAuthenticated, currentUser, sendWebSocketMessage } = useUserContext()

	const createNewGuild = (guildName: string) => {
		const guild = new CreateGuildEvent(currentUser.id, guildName)
		sendWebSocketMessage(guild)
	}

	return (
		<div>
			{isAuthenticated ? (
				<GuildsPanel
					currentUser={currentUser}
					createNewGuild={createNewGuild}
				></GuildsPanel>
			) : (
				<RegisterLoginOption />
			)}
		</div>
	)
}
