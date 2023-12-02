"use client"


import React, { useState, useEffect } from 'react'
import TextChannel from './TextChannel'
import { Button } from '@nextui-org/react'

export default function WebSocketTester() {

    const [connected, setConnected] = useState(false)
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        return () => {
            if(socket && socket.readyState === WebSocket.OPEN){
                socket.close()
            }
        }
    },[socket])

    const connectToSocket = () => {
        if(!socket || socket.readyState !== WebSocket.OPEN) {
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
                console.log("Error: ",error)
            }
        }
    }

    const disconnectFromSocket = () => {
        if(socket && socket.readyState === WebSocket.OPEN){
            socket.close()
        }
        setConnected(false)
        setSocket(null)
    }
    


  return (
    <div>
        {!connected ? (<Button onPress={connectToSocket}>Connect</Button>) : (<Button onPress={disconnectFromSocket}>Disconnect</Button>)}
    </div>
  )
}