"use client"

import { GuildDTO } from "./DTOs/GuildDTO"
import GuildsPanel from "./components/Guild/GuildsPanel"
import RegisterLoginOption from "./components/User/RegisterLoginOption"
import { useUserContext } from "./context/UserContext"

export default function App() {
	const { isAuthenticated, currentUser } = useUserContext()

	const createNewGuild = (guildName: string) => {
		currentUser.joinGuild(new GuildDTO("1", guildName, currentUser.id))
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
