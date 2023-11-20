

import React from 'react'
import { Button, Input } from '@nextui-org/react'

export default function ChatPage() {


    return (
        <div className='flex flex-col justify-between h-screen items-center'>
            <div className='message-container overflow-y-auto flex-1 w-full'></div>
            <Input className='' radius='none' placeholder='Say something...' size='lg' endContent={
                <Button isIconOnly className='bg-transparent' disableRipple>
                    <span className="material-symbols-outlined">
                        send
                    </span>
                </Button>
            }>

            </Input>
        </div>
    )
}
