import { useEffect, useRef, useState } from 'react';

export interface WebSocketData {
	type: number
	body: any
}

export interface ChatMessage {
	userId : string,
	guildId : string
	channelId : string
	message : string
}

const useWebSocket = () => {
	const [receivedMessage, setReceivedMessage] = useState<WebSocketData>({ type: -1, body: null });
	const socketRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		connectToWs()
		return () => {
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, []);

	const connectToWs = () => {
		var userId = Math.floor(Math.random() * 11)
		socketRef.current = new WebSocket(`ws://127.0.0.1:8080/ws?id=${userId}`);

		const socket = socketRef.current;

		socket.onopen = () => {
			console.log("Websocket Open")
			/* sendLogInData({
				Type: 0,
				Body: {
					UserId: userId.toString(),
					GuildIds: ["1"]
				}
			}) */
			//console.log('WebSocket connected');
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
			switch (newReceivedData.type){
				case 1:
					setReceivedMessage({
						type : newReceivedData.type,
						body : newReceivedData.body as ChatMessage
					})
			}
		};
	}

	const sendLogInData = (data: {
		Type: number,
		Body: {
			UserId: string,
			GuildIds: string[]
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

	return { connectToWs, sendLogInData, sendWebSocketMessage, receivedMessage };
};

export default useWebSocket;
