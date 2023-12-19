import { useRef, useState } from "react"
import { LogoutEvent } from "../DTOs/UserDTO"
import { IEvent } from "../DTOs/Types"

const useWebSocket = () => {
	const [receivedMessage, setReceivedMessage] = useState<IEvent>({ type: -1, body: null })
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
			console.log("Received:", event.data)
			var newReceivedData = JSON.parse(event.data) as IEvent
			setReceivedMessage(newReceivedData)
		}

	}

	const disconnectFromWs = () => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			var message: string = JSON.stringify(new LogoutEvent())
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
