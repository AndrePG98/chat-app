import { createContext, useContext, useEffect, useState } from "react"
import { User } from "../DTOs/User"
import { DataTransferObject, LoginRequest, RegisterRequest } from "../DTOs/MessageDTOs"
import useWebSocket from "../services/WebSocketService"

interface AuthContextProps {
	authenticated: boolean
	currentUser: User
	login: (id: string, name: string) => void
	logout: () => void
	register: (id: string, name: string, guilds: string[]) => void
	receivedMessage: DataTransferObject
	sendWebSocketMessage: (data: any) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: any) => {
	const { connectToWs, disconnectFromWs, authenticated,sendWebSocketMessage, receivedMessage } = useWebSocket()
	const [currentUser, setCurrentUser] = useState(new User("", "",""))

	const register = (id: string, name: string) => {
		connectToWs(id,(connected : boolean) => {
			if(connected) {
				sendWebSocketMessage(new RegisterRequest(id))
			const user = new User(id, name, "https://source.unsplash.com/random/?avatar")
			user.setGuilds(["1"])
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
