import { createContext, useContext, useState } from "react"
import { DataExchangeObject, RegisterRequest } from "../DTOs/RequestsDTOs"
import { UserDTO } from "../DTOs/UserDTO"
import useWebSocket from "../services/WebSocketService"

interface AuthContextProps {
	authenticated: boolean
	currentUser: UserDTO
	login: (id: string, name: string) => void
	logout: () => void
	register: (id: string, name: string, guilds: string[]) => void
	receivedMessage: DataExchangeObject
	sendWebSocketMessage: (data: any) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: any) => {
	const [currentUser, setCurrentUser] = useState(new UserDTO("", "", ""))
	const { connectToWs, disconnectFromWs, authenticated, sendWebSocketMessage, receivedMessage } =
		useWebSocket(currentUser)

	const register = (id: string, name: string) => {
		connectToWs(id, (connected: boolean) => {
			if (connected) {
				sendWebSocketMessage(new RegisterRequest(id))
				const user = new UserDTO(id, name, "https://source.unsplash.com/random/?avatar")
				setCurrentUser(user)
			}
		})
	}

	const login = async (id: string, name: string) => {
		register(id, name)
	}

	const logout = () => {
		disconnectFromWs(currentUser.id)
	}

	return (
		<AuthContext.Provider
			value={{
				authenticated,
				currentUser,
				login,
				logout,
				register,
				sendWebSocketMessage,
				receivedMessage,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
