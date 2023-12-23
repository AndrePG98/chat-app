"use client"

import { CreateGuildEvent, GuildDTO } from "./DTOs/GuildDTO"
import GuildsPanel from "./components/Guild/GuildsPanel"
import RegisterLoginOption from "./components/User/RegisterLoginOption"
import { useUserContext } from "./context/UserContext"

export default function App() {
	const { isAuthenticated, currentUser, sendWebSocketMessage } = useUserContext()

	return (
		<div className="bg-surface-300">
			{isAuthenticated ? (
				<GuildsPanel currentUser={currentUser}></GuildsPanel>
			) : (
				<RegisterLoginOption />
			)}
		</div>
	)
}
