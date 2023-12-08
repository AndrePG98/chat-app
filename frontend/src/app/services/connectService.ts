import { useRef, useState } from "react"
import { User } from "../DTOs/User"
import useWebSocket from "./WebSocketService"

const useConnectService = () => {
	// Optimize component so it only runs if missing inial state and not after refreshing
	const { connectToWs, sendWebSocketMessage, receivedMessage } = useWebSocket()
	const fetchedRef = useRef<boolean>()

	const connectUser = async (user: User) => {
		try {
			if (!fetchedRef.current) {
				const result = await fetch(`http://127.0.0.1:8090/connect?id=${user.id}`, {
					method: "GET",
				})
				if (result.ok) {
					const response = await result.json()
					fetchedRef.current = true
					const guildIds = response.body.guildIds as string[]
					connectToWs(user)
				}
			}
		} catch (error) {
			console.error("Error connecting:", error)
		}
	}

	return {
		connectUser,
		sendWebSocketMessage,
		receivedMessage,
	}
}

export default useConnectService
