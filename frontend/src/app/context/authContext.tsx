import { createContext, useContext, useEffect, useState } from "react"
import { User } from "../DTOs/UserDTO"
import { DataTransferObject, LoginRequest, RegisterRequest } from "../DTOs/RequestDTO"
import useWebSocket from "../services/WebSocketService"

interface AuthContextProps {
	authenticated: boolean
	currentUser: User
	login: (username : string, password : string) => void
	logout: () => void
	register: (username: string, password : string ,email : string) => void
	receivedMessage: DataTransferObject
	sendWebSocketMessage: (data: any) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: any) => {
	const { connectToWs, disconnectFromWs, authenticated,sendWebSocketMessage, receivedMessage } = useWebSocket()
	const [currentUser, setCurrentUser] = useState(new User("", "" ,"", ""))

	const register = (username: string, password: string, email : string) => {
		connectToWs((connected : boolean) => {
			if(connected) {
				sendWebSocketMessage(new RegisterRequest(username, password, email))
			/* const user = new User(id, name, "https://source.unsplash.com/random/?avatar")
			user.setGuilds(["1"])
			setCurrentUser(user) */
			}
		})
	}

	const login = async (username: string, password: string) => {
		connectToWs((connected : boolean) => {
			if(connected) {
				sendWebSocketMessage(new LoginRequest(username, password))
			}
		})
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
