import { createContext, useContext } from "react"
import useConnectService from "../services/connectService"
import { WebSocketData } from "../services/WebSocketService"

interface ConnectContextProps {
	receivedMessage: WebSocketData
	sendWebSocketMessage: (data: any) => void
}

const ConnectContext = createContext<ConnectContextProps | undefined>(undefined)

export const ConnectProvider = ({ children }: any) => {
	const { sendWebSocketMessage, receivedMessage } = useConnectService()
	return (
		<ConnectContext.Provider value={{ sendWebSocketMessage, receivedMessage }}>
			{children}
		</ConnectContext.Provider>
	)
}

export const useConnect = () => {
	const context = useContext(ConnectContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
