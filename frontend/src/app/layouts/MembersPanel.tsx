import React, { useState } from 'react';
import { User } from '@nextui-org/react';



export default function MembersPanel() {
    const [users, setUsers] = useState<string[]>(["User1", "User2"])

    return (
        <div className='w-52  border-l border-gray-700 flex flex-col justify-start items-start py-5 px-4 gap-5 overflow-y-auto' style={{border: "2px solid white"}}>
            {
                users.map((name, index) => (
                    <User
                        key={index}
                        className='text-amber-100'
                        name={name}
                        avatarProps={{ src: 'https://i.pravatar.cc/150?u=a04258114e29026702d', size: "sm" }}
                    />
                ))
            }
        </div>
    );
}
