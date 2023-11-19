'use client'

import React, { useState } from 'react';
import { Button, Listbox, ListboxSection, ListboxItem, User, baseStyles } from '@nextui-org/react';

export default function (props: { name: String }) {

    const [channelUsers, setChannelUsers] = useState<React.ReactNode[]>([])

    function addChannelUser() {
        let newUser = <User
            name="Jane Doe"
            avatarProps={{
                src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
            }}
        />
        setChannelUsers((prevChannelUsers) => [...prevChannelUsers, newUser]);
    }

    return (
        <div>
            <Button className="h-8 w-full" endContent={<span className="material-symbols-outlined ml-8">volume_up</span>} onClick={addChannelUser}>
                {props.name}
            </Button>
            <Listbox itemClasses={{
                base : "ml-5"
            }}>
                {channelUsers.map((user, index) => (
                    <ListboxItem key={index}>{user}</ListboxItem>
                ))}
            </Listbox>
        </div>
    );
}