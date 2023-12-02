"use client"


import React, { useState, useEffect } from 'react'
import TextChannel from './TextChannel'
import { Button } from '@nextui-org/react'
import ChatPanel from '../layouts/ChatPanel'
import Message from '../shared/components/Message'

export default function WebSocketTester() {
    const [connected, setConnected] = useState(false)
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [messages, setMessages] = useState<string[]>([])
    

    const sendMessage = (message : string) => {
        if(socket && socket.readyState === WebSocket.OPEN){
            socket.send(message)
        }
    }

    useEffect(() => {
        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close()
            }
        }
    }, [socket])

    const connectToSocket = () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            const ws = new WebSocket("ws://localhost:8080/ws")
            ws.onopen = () => {
                setSocket(ws)
                setConnected(true)
            }

            ws.onclose = () => {
                console.log(socket)
                setConnected(false)
            }

            ws.onerror = (error) => {
                console.log("Error: ", error)
            }

            ws.onmessage = (e) => {
                setMessages((prevMessages) => [...prevMessages, e.data]);
            }
        }
    }

    const disconnectFromSocket = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close()
        }
        setConnected(false)
        setSocket(null)
    }



    return (
        <div className='flex flex-col gap-2'>
            {!connected ? (<Button onPress={connectToSocket}>Connect</Button>) : (<Button onPress={disconnectFromSocket}>Disconnect</Button>)}
            <ChatPanel messages={messages} channelId={0} createNewMessage={sendMessage}></ChatPanel>
        </div>
    )
}