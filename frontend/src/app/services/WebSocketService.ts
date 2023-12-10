import { useRef, useState } from "react"
import { AuthenticationResult, ChatMessageRequest, DataTransferObject, LoginRequest, LogoutRequest, RegisterRequest } from "../DTOs/MessageDTOs"

const useWebSocket = () => {
	const [receivedMessage, setReceivedMessage] = useState<DataTransferObject>({ type: -1, body: null })
	const [authenticated, setAuthenticated] = useState(false)
	const socketRef = useRef<WebSocket | null>(null)

	const connectToWs = async (onConnectionEstablished: (status: boolean) => void) => {
		socketRef.current = new WebSocket(`ws://127.0.0.1:8080/ws`)
		//const socket = socketRef.current

		socketRef.current.onopen = () => {
			// send username and password for authentication
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
			// server sends back session token .

			console.log("Received:", event.data)
			var newReceivedData = JSON.parse(event.data) as DataTransferObject
			switch (newReceivedData.type) {
				case 0:
					const authResult = newReceivedData as AuthenticationResult
					if (authResult.body.result) {

					}
					setAuthenticated(newReceivedData.body.result)
					//set Initial State
					break
				case 2:
					setReceivedMessage(newReceivedData as LogoutRequest)
					setAuthenticated(newReceivedData.body.result)
					break
				case 3:
					setReceivedMessage(newReceivedData as ChatMessageRequest)
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
