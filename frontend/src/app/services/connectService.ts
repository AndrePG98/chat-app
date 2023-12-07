import { useRef, useState } from 'react';
import { User } from '../DTOs/User';
import useWebSocket from './WebSocketService';

const useConnectService = () => {

    // Optimize component so it only runs if missing inial state and not after refreshing
    const { connectToWs, sendWebSocketMessage, receivedMessage } = useWebSocket();
    const [connected, setConnected] = useState<boolean>(false);
    const fetchedRef = useRef<boolean>();
    const [loggedUser, setLoggedUser] = useState<User>({
        id: "",
        name: "",
        guilds: []
    })

    const login = async (userId: string, userName: string, guilds: string[]) => {
        try {
            if (!fetchedRef.current) {
                const result = await fetch(`http://127.0.0.1:8090/connect?id=${userId}`, {
                    method: 'GET'
                });
                if (result.ok) {
                    const response = await result.json()
                    fetchedRef.current = true
                    const guildIds = response.body.guildIds as string[]
                    connectToWs({ id: userId, name: userName, guilds: guildIds })
                    setLoggedUser({
                        id: userId,
                        name: userName,
                        guilds: guilds

                    })
                    setConnected(false)
                    console.log(connected);
                }
            }

        } catch (error) {
            console.error('Error connecting:', error);
        }
    }

    return { loggedUser, login, sendWebSocketMessage, receivedMessage, connected };
};

export default useConnectService;