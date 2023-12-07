import React, { createContext, useContext } from 'react';
import { User } from '../DTOs/User';
import { WebSocketData } from '../services/WebSocketService';
import useConnectService from '../services/connectService';

interface userContextProps {
    loggedUser: User
    login: (userId: string, userName: string) => void,
    sendWebSocketMessage: (data: any) => void;
    receivedMessage: WebSocketData;
    connected: boolean;
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

    const { login, sendWebSocketMessage, receivedMessage, loggedUser, connected } = useConnectService()

    return (
        <userContext.Provider value={{ loggedUser, login, sendWebSocketMessage, receivedMessage,  connected }}>
            {props.children}
        </userContext.Provider>
    )
}