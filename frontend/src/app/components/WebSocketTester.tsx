"use client"


import React, { useState, useEffect } from 'react'
import TextChannel from './TextChannel'
import { Button } from '@nextui-org/react'

export default function WebSocketTester() {
    const [connected, setConnected] = useState(false)
    const [socket, setSocket] = useState<WebSocket | null>(null)

    const sendMessage = () => {
        var message = (document.getElementById("message") as HTMLInputElement).value
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
                alert(e.data)
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
            <br />
            <input type="text" id='message' name='message' className='h-10'/>
            <br />
            <Button onPress={sendMessage}>Send</Button>
            <br />
            <div className='flex flex-col justify-start items-center p-5 bg-white' id='chat'></div>
        </div>
    )
}