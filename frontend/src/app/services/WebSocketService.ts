import { useEffect, useRef, useState } from 'react';

interface WebSocketData {
  type: string;
  payload: any;
}

const useWebSocket = () => {
  const [receivedMessage, setReceivedMessage] = useState<WebSocketData>({ type : "", payload : ""});
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://127.0.0.1:8080/ws");

    const socket = socketRef.current;

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onclose = (event) => {
      console.log('WebSocket closed', event);
      // Implement reconnect logic if needed
    };

    socket.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    socket.onmessage = (event) => {
        const newReceivedData : WebSocketData = {
            type :  "String",
            payload : event.data
        }
      //const message: WebSocketData = JSON.parse(event.data);
      setReceivedMessage(newReceivedData);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendWebSocketMessage = (data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not open');
    }
  };

  return { sendWebSocketMessage, receivedMessage };
};

export default useWebSocket;
