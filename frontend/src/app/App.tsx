"use client"

import React from "react"
import { useUserContext } from "./context/UserContext"
import RegisterLoginOption from "./components/User/RegisterLoginOption"
import GuildsPanel from "./components/Guild/GuildsPanel"

export default function App() {
	const { isAuthenticated, currentUser } = useUserContext()

	return (
		<div>
			{isAuthenticated ? (
				<GuildsPanel currentUser={currentUser}></GuildsPanel>
			) : (
				<RegisterLoginOption />
			)}
		</div>
	)
}
