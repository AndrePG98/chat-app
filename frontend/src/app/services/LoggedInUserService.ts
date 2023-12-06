import { createContext } from 'react';
import { User } from '../DTOs/User';
import React from 'react';

export const UserContext = createContext<User | undefined>(undefined);

export default function useLoggedInUser() {
    const [userId, setUserId] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [guilds, setGuilds] = React.useState('');

    const createNewUser = (userId: string, userName: string, guilds: string) => {
        const user = new User(userId, userName, guilds)
        console.log(user);
    }

    return {userId, setUserId, userName, setUserName, guilds, setGuilds, createNewUser}

}
