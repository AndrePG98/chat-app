/* import React, { createContext, useContext, useEffect } from 'react';


export const WebSocketContext = createContext<{ ws : WebSocket | null}>({ws : null})


export default function WebSocketProvider(props : { children : React.ReactNode}) {

    const ws = new WebSocket("ws://localhost:8080/ws")

  return (
    <WebSocketContext.Provider value={{ ws : ws}}>
        {props.children}
    </WebSocketContext.Provider>
  )
} */
