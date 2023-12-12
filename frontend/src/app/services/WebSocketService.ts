import { useRef, useState } from "react"
import {
	ChatMessageRequest,
	DataExchangeObject,
	LoginRequest,
	LogoutRequest,
	RegisterRequest,
} from "../DTOs/RequestsDTOs"
import { UserDTO } from "../DTOs/UserDTO"

const useWebSocket = (currentUser: UserDTO) => {
	const [receivedMessage, setReceivedMessage] = useState<DataExchangeObject>({
		type: -1,
		body: null,
	})
	const [authenticated, setAuthenticated] = useState(false)
	const socketRef = useRef<WebSocket | null>(null)

	const connectToWs = async (
		userId: string,
		onConnectionEstablished: (status: boolean) => void
	) => {
		socketRef.current = new WebSocket(`ws://127.0.0.1:8080/ws?id=${userId}`)
		//const socket = socketRef.current

		socketRef.current.onopen = () => {
			onConnectionEstablished(true)
		}

		socketRef.current.onclose = (event) => {
			console.log("WebSocket closed", event)
			// Implement reconnect logic if needed
		}

		socketRef.current.onerror = (error) => {
			console.error("WebSocket error", error)
		}

		socketRef.current.onmessage = (event) => {
			console.log("Received:", event.data)
			var newReceivedData = JSON.parse(event.data) as DataExchangeObject
			switch (newReceivedData.type) {
				case 0:
					setReceivedMessage(newReceivedData as RegisterRequest)
					setAuthenticated(newReceivedData.body.result)
					break
				case 1:
					setReceivedMessage(newReceivedData as LoginRequest)
					setAuthenticated(newReceivedData.body.result)
					break
				case 2:
					setReceivedMessage(newReceivedData as LogoutRequest)
					setAuthenticated(newReceivedData.body.result)
					break
				case 3:
					setReceivedMessage(newReceivedData as ChatMessageRequest)
					console.log(newReceivedData)

					const guild = currentUser.getGuild("1")
					const channel = guild?.getChannel("1")
					channel?.addMessage(currentUser, newReceivedData.body.content)
					console.log(guild)
					console.log(currentUser.getGuilds)
					break
			}
		}
	}

	const disconnectFromWs = (userId: string) => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			var message: string = JSON.stringify(new LogoutRequest(userId))
			socketRef.current.send(message)
		} else {
			console.error("WebSocket is not open")
		}
	}

	const sendWebSocketMessage = (data: any) => {
		console.log("Sent:", data)
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			var message: string = JSON.stringify(data)
			socketRef.current.send(message)
		} else {
			console.error("WebSocket is not open")
		}
	}

	return { connectToWs, disconnectFromWs, authenticated, sendWebSocketMessage, receivedMessage }
}

export default useWebSocket
