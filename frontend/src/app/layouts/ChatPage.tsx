

import React, { useEffect, useRef, useState } from 'react'
import { Button, Input } from '@nextui-org/react'
import Message from '../shared/components/Message'

export default function ChatPage() {
    const [input, setInput] = React.useState("")
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<React.ReactNode[]>([])

    function addMessage(message: string) {
        if(message === ""){
            return;
        }
        setMessages((prevMessages) => [...prevMessages, <Message message={message}></Message>])
    }


    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && input !== "") {
            event.preventDefault()
            addMessage(input)
            setInput("")
        }
    }

    useEffect(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, [messages]);
    


    return (
        <div className='flex flex-col h-full px-3'>
            <div ref={chatContainerRef} className='flex flex-col gap-10 message-container overflow-y-auto flex-1 w-full pt-5 px-3 pb-3'>
                {messages.map((message) => (
                    message
                ))}
            </div>
            <div className='mx-5 mb-4 mt-1'>
                <Input className=''
                    radius='md'
                    variant='bordered'
                    placeholder='Say something...'
                    value={input}
                    onValueChange={setInput}
                    onKeyDown={handleKeyPress}
                    endContent={
                        <Button isIconOnly className='bg-transparent outline-none' color='primary' disableRipple variant='flat' onPress={
                            () => {
                                addMessage(input);
                            }
                        }>
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
