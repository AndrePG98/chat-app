

import React from 'react'
import { Button, Input, Card, Avatar } from '@nextui-org/react'
import Message from '../shared/components/Message'

export default function ChatPage() {


    return (
        <div className='flex flex-col h-screen'>
            <div className='message-container overflow-y-auto flex-1 w-full pt-5 px-3 flex flex-col gap-3'>
                <Message></Message>
                <Message></Message>
            </div>
            <div className='mx-5 mb-4 mt-1'>
                <Input className='' radius='md' variant='bordered' placeholder='Say something...' endContent={
                    <Button isIconOnly className='bg-transparent' color='primary' disableRipple variant='flat'>
                        <span className="material-symbols-outlined">
                            send
                        </span>
                    </Button>
                }>
                </Input>
            </div>
        </div>
    )
}
