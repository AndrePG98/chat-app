"use client"

import { Button, Input } from '@nextui-org/react';
import React, { createContext, useState } from 'react';
import { User } from '../DTOs/User';
import useLoggedInUser from '../services/LoggedInUserService';

export const UserContext = createContext<User | undefined>(undefined);

export default function LoggedInUser() {
    const [finalUser, setFinalUser] = useState<User>();
    const {userId, setUserId, userName, setUserName, guilds, setGuilds}=useLoggedInUser()

    const createNewUser = (userId: string, userName: string, guilds: string) => {
        const user = new User(userId, userName, guilds)
        setFinalUser(user)
        console.log("created user", finalUser);
        
    }
    
    return (
        <UserContext.Provider value={finalUser}>
            <div>
                <Input
                    label="userId"
                    value={userId}
                    onValueChange={setUserId}>
                </Input>
                <Input
                    label="userName"
                    value={userName}
                    onValueChange={setUserName}>
                </Input>
                <Input
                    label="guilds"
                    value={guilds}
                    onValueChange={setGuilds}>
                </Input>
                <Button
                    onPress={() => {
                        createNewUser(userId, userName, guilds);
                    }}>
                        Create User
                </Button>
            </div>
        </UserContext.Provider>
    )
}
