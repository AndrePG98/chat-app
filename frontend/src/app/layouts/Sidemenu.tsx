'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Divider, User } from '@nextui-org/react';

export default function Sidemenu() {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <aside className='h-screen w-60 py-5 px-4 border-r border-gray-700 flex flex-col'>
            <nav className='flex justify-center items-center'>
                {/* <Button isIconOnly className={`rounded-full transform ${isHovered ? 'scale-125' : 'scale-100'} transition-all ease-in-out`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <Image
                        src="/user.svg"
                        alt="User"
                        width={15}
                        height={15}
                    />
                </Button> */}
                <div className='space-y-3'>
                    <User
                        name="Jane Doe"
                        description="Product Designer"
                        avatarProps={{
                            src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                        }}
                    />
                    <Divider className='w-52'></Divider>
                    <div className="flex justify-center flex-col space-y-3">
                        <Button className='w-full' endContent={<span className="material-symbols-outlined ml-8">edit</span>}>
                            Text Channel 1
                        </Button>
                    </div>
                </div>
            </nav>
        </aside>
    );
}
