"use client"

import GuildsPanel from "./components/Guild/GuildsPanel"
import RegisterLoginOption from "./components/User/RegisterLoginOption"
import { useUserContext } from "./context/UserContext"

export default function App() {
	const { isAuthenticated, currentUser } = useUserContext()

	const createNewGuild = (guildName: string) => {
		currentUser.addGuild(guildName)
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
