import { createContext, useContext, useState } from "react"
import { User } from "../DTOs/User"
import useConnectService from "../services/connectService"

interface AuthContextProps {
	authenticated: boolean
	currentUser: User
	login: (id: string, name: string, guilds: string[]) => void
	logout: () => void
	register: (id: string, name: string, guilds: string[]) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: any) => {
	const { connectUser } = useConnectService()
	const [authenticated, setAuthenticated] = useState<boolean>(false)
	const [currentUser, setCurrentUser] = useState(new User("", "", [], ""))

	const register = (id: string, name: string, guilds: string[]) => {
		login(id, name, guilds)
	}

	const login = async (id: string, name: string, guilds: string[]) => {
		const user = new User(id, name, guilds, "https://source.unsplash.com/random/?avatar")
		setCurrentUser(user)
		setAuthenticated(true)
		connectUser(user)
	}

	const logout = () => {
		setAuthenticated(false)
	}

	return (
		<AuthContext.Provider
			value={{
				authenticated,
				currentUser,
				login,
				logout,
				register,
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
