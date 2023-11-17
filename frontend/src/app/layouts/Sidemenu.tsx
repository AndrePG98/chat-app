'use client';

import React, { useState } from 'react'
import { Button } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

export default function Sidemenu() {

    const [sideBarWidth, setSideBarWidth] = useState('5%');

    const handleMouseEnter = () => { setSideBarWidth('10%') };

    const handleMouseExit = () => { setSideBarWidth('5%') }

    //const image = <Image src='/icon.png' width={30} height={30} alt='image' />

    return (
        <aside
            className='h-screen transition-all duration-300 ease-in-out'
            style={{ width: sideBarWidth }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseExit}>
            <nav className='h-full flex flex-col border-r-1 shadow justify-start items-center py-5 px-3 gap-y-6'>
                <div className='flex justify-center items-center'>
                    <Button color='primary' className='rounded-full'>
                    </Button>
                </div>
            </nav>
        </aside>
    )
}
