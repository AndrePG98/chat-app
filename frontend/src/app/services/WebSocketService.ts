import { useRef, useState } from 'react';
import { User } from '../DTOs/User';

export interface WebSocketData {
	type: number
	body: any
}

export interface ChatMessage {
	userId: string,
	guildId: string
	channelId: string
	message: string
}

const useWebSocket = () => {
	const [receivedMessage, setReceivedMessage] = useState<WebSocketData>({ type: -1, body: null });
	const socketRef = useRef<WebSocket | null>(null);

	const connectToWs = (user: User) => {

		socketRef.current = new WebSocket(`ws://127.0.0.1:8080/ws?id=${user.id}`);
		const socket = socketRef.current;

		socket.onopen = () => {
			sendLogInData({
				Type: 0,
				Body: {
					userId: user.id,
					guildIds: user.guilds
				}
			})
		};

		socket.onclose = (event) => {
			console.log('WebSocket closed', event);
			// Implement reconnect logic if needed
		};

		socket.onerror = (error) => {
			console.error('WebSocket error', error);
		};

		socket.onmessage = (event) => {
			const newReceivedData = JSON.parse(event.data) as WebSocketData;
			switch (newReceivedData.type) {
				case 1: // Chat Message Type
					setReceivedMessage({
						type: newReceivedData.type,
						body: newReceivedData.body as ChatMessage
					})
			}
		};
	}

	const sendLogInData = (data: {
		Type: number,
		Body: {
			userId: string,
			guildIds: string[]
		}
	}) => {

		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			socketRef.current?.send(JSON.stringify(data))
		} else {
			console.error('WebSocket is not open');
		}
	}

	const sendWebSocketMessage = (data: any) => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			var message: string = JSON.stringify(data)
			socketRef.current.send(message);
		} else {
			console.error('WebSocket is not open');
		}
	};

	return { connectToWs, sendWebSocketMessage, receivedMessage };
};

export default useWebSocket;