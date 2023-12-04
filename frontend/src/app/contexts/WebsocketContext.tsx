import React, { createContext, useContext } from 'react';
import useWebSocket from '../services/WebSocketService';

interface WebSocketData {
    type: string;
    payload: any;
}

interface WebSocketContextProps {
    sendWebSocketMessage: (data: any) => void;
    receivedMessage: WebSocketData;
}


const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within a WebSocketProvider');
    }
    return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { sendWebSocketMessage, receivedMessage } = useWebSocket();

    return (
        <WebSocketContext.Provider value={{ sendWebSocketMessage, receivedMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};
