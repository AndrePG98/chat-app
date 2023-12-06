import React, { createContext, useContext } from 'react';
import useWebSocket, { WebSocketData } from '../services/WebSocketService';
import { User } from '../DTOs/User';

interface WebSocketContextProps {
    user : User
    login : (userId: string, userName: string, guilds: string[]) => void,
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
    const { user, login , sendWebSocketMessage, receivedMessage } = useWebSocket();

    return (
        <WebSocketContext.Provider value={{ user, login, sendWebSocketMessage, receivedMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};
