'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@nextui-org/react';

export default function Sidemenu() {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <aside className='h-screen transition-all duration-300 ease-in-out py-5 px-4 border-r border-gray-700 flex flex-col'>
            <nav className='flex justify-center items-center'>
                <Button isIconOnly className={`rounded-full transform ${isHovered ? 'scale-125' : 'scale-100'} transition-all ease-in-out`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <Image
                        src="/user.svg"
                        alt="User"
                        width={15}
                        height={15}
                    />
                </Button>
            </nav>
        </aside>
    );
}