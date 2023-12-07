// authContext.tsx

import { createContext, useContext, useState } from "react"
import { User } from "../DTOs/User"
import useConnectService from "../services/connectService"

interface AuthContextProps {
	authenticated: boolean
	currentUser: User
	login: (id: number, name: string, guilds: string[]) => void
	logout: () => void
	register: (id: number, name: string, guilds: string[]) => void
	handleSetCurrentUser: (id: number, name: string, guilds: string[]) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: any) => {
	const [authenticated, setAuthenticated] = useState<boolean>(false)
	const [currentUser, setCurrentUser] = useState(new User(0, "", []))

	const register = (id: number, name: string, guilds: string[]) => {
		login(id, name, guilds)
	}

	const login = (id: number, name: string, guilds: string[]) => {
		handleSetCurrentUser(id, name, guilds)
	}

	const logout = () => {
		setAuthenticated(false)
	}

	const handleSetCurrentUser = (id: number, name: string, guilds: string[]) => {
		const user = new User(id, name, guilds)
		setCurrentUser(user)
		setAuthenticated(true)
		console.log(user)
	}

	return (
		<AuthContext.Provider
			value={{ authenticated, currentUser, login, logout, register, handleSetCurrentUser }}
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
