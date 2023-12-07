import { useRef, useState } from "react"
import { User } from "../DTOs/User"
import useWebSocket from "./WebSocketService"

const useConnectService = async (user: User) => {
	// Optimize component so it only runs if missing inial state and not after refreshing
	const { connectToWs, sendWebSocketMessage, receivedMessage } = useWebSocket()
	const [connected, setConnected] = useState<boolean>(false)
	const fetchedRef = useRef<boolean>()

	try {
		if (!fetchedRef.current) {
			const result = await fetch(`http://127.0.0.1:8090/connect?id=${user.id}`, {
				method: "GET",
			})
			if (result.ok) {
				fetchedRef.current = true
				connectToWs(user)
				setConnected(false)
				console.log("New user connected ", user)
			}
		}
	} catch (error) {
		// console.error("Error connecting:", error)
	}

	return {
		receivedMessage,
		connected,
	}
}

export default useConnectService
