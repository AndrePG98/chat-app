"use client"

import { Button, Input } from '@nextui-org/react';
import React, { useContext, useState } from 'react';
import { useUserContext } from '../contexts/userContext';
import { WebSocketData } from '../services/WebSocketService';


export default function LoggedInUser() {
    const {login} = useUserContext()
    const [userIdInput, setUserIdInput] = useState("")
    const [userNameInput, setUserNameInput] = useState("")
    const [userGuildsInput, setUserGuildsInput] = useState("")

    /* const createNewUser = (userId: string, userName: string, guilds: string) => {
        const user = new User(userId, userName, guilds)
        setFinalUser(user)
        console.log("created user", finalUser);
        
    } */

    return (
        <div>
            <Input
                label="userId"
                value={userIdInput}
                onValueChange={setUserIdInput}>
            </Input>
            <Input
                label="userName"
                value={userNameInput}
                onValueChange={setUserNameInput}>
            </Input>
            <Input
                label="guilds"
                value={userGuildsInput}
                onValueChange={setUserGuildsInput}>
            </Input>
            <Button
                onPress={() => {
                    login(userIdInput, userNameInput);
                }}>
                Create User
            </Button>
        </div>
    )
}
