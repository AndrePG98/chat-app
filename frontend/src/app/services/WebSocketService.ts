import { useRef, useState } from "react"
import { LogoutEvent } from "../DTOs/UserDTO"
import { IEvent } from "../DTOs/Types"

const useWebSocket = () => {
	const [receivedMessage, setReceivedMessage] = useState<IEvent>({ type: -1, body: null })
	const socketRef = useRef<WebSocket | null>(null)

	const connectToWs = async (onConnectionEstablished: (status: boolean) => void) => {
		socketRef.current = new WebSocket(`ws://85.242.68.120:8080/ws`)

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
			var newReceivedData = JSON.parse(event.data) as IEvent
			console.log("Received:", newReceivedData)
			setReceivedMessage(newReceivedData)
		}

	}

	const disconnectFromWs = (userId: string) => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			var message: string = JSON.stringify(new LogoutEvent(userId))
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

	return { connectToWs, disconnectFromWs, sendWebSocketMessage, receivedMessage }
}

export default useWebSocket
