import React from 'react'
import Image from 'next/image'

export default function Sidemenu() {
    return (
        <aside className='h-screen w-32'>
            <nav className='h-full flex flex-col border-r-1 shadow'>
                <div className='p-4 pb-2 flex justify-between items-center'>
                    <Image
                        src="/icon.png"
                        alt="Example Image"
                        width={100}
                        height={100}
                        className='rounded-lg'
                    />
                </div>
            </nav>
        </aside>
    )
}
