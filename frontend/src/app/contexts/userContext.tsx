import React, { createContext, useContext } from 'react';
import useWebSocket, { WebSocketData } from '../services/WebSocketService';
import { User } from '../DTOs/User';
import useConnectService from '../services/connectService';

interface userContextProps {
    loggedUser: User
    login: (userId: string, userName: string) => void,
    sendWebSocketMessage: (data: any) => void;
    receivedMessage: WebSocketData;
}


const userContext = createContext<userContextProps | any>(undefined);

export const useUserContext = () => {
    const ctx = useContext(userContext) as userContextProps
    if (!ctx) {
        throw new Error("Bad contex")
    }
    return ctx
}


export default function UserContextProvider(props: { children: React.ReactNode }) {

    const { login, sendWebSocketMessage, receivedMessage, loggedUser } = useConnectService()

    return (
        <userContext.Provider value={{ login, sendWebSocketMessage, receivedMessage, loggedUser }}>
            {props.children}
        </userContext.Provider>
    )
}