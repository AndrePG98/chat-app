import { createContext, useContext, useEffect, useState } from "react"
import { UserDTO } from "../DTOs/UserDTO"
import { DataTransferObject, LoginRequest, RegisterRequest } from "../DTOs/RequestDTO"
import useWebSocket from "../services/WebSocketService"
import { GuildDTO } from "../DTOs/GuildDTO"
import { MessageDTO } from "../DTOs/MessageDTO"
import { ChannelDTO } from "../DTOs/ChannelDTO"

interface UserContextProps {
	isAuthenticated: boolean
	currentUser: UserDTO
	login: (username: string, password: string) => void
	logout: () => void
	register: (username: string, password: string, email: string) => void
	receivedMessage: DataTransferObject
	sendWebSocketMessage: (data: any) => void
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserContextProvider = ({ children }: any) => {
	const [currentUser, setCurrentUser] = useState(new UserDTO("", "", "", ""))
	const { connectToWs, disconnectFromWs, sendWebSocketMessage, receivedMessage } =
		useWebSocket(currentUser) // only available inside user context
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		switch (receivedMessage.type) {
			case 0:
				authenticate(receivedMessage.body.userId, receivedMessage.body.state)
				break
			case 3:
				receiveMessage(
					receivedMessage.body.userId,
					receivedMessage.body.content,
					receivedMessage.body.guildId,
					receivedMessage.body.channelId
				)
				break
		}
	}, [receivedMessage])

	const register = (username: string, password: string, email: string) => {
		connectToWs((connected: boolean) => {
			if (connected) {
				sendWebSocketMessage(new RegisterRequest(username, password, email))
			}
		})
	}

	const authenticate = (id: string, guilds: string[]) => {
		const user = new UserDTO(
			id,
			"Username",
			"Email",
			"https://source.unsplash.com/random/?avatar"
		)
		guilds.forEach((guildId) => {
			const newGuild = new GuildDTO(guildId, "GuildName")
			newGuild.addChannel(new ChannelDTO("1", "Some channel", "text"))
			user.joinGuild(newGuild)
		})
		setCurrentUser(user)
		setIsAuthenticated(true)
	}

	const login = async (username: string, password: string) => {
		connectToWs((connected: boolean) => {
			if (connected) {
				sendWebSocketMessage(new LoginRequest(username, password))
			}
		})
	}

	const logout = () => {
		disconnectFromWs(currentUser.id)
	}

	const sendMessage = (message: string, guildId: string, channelId: string) => {
		sendWebSocketMessage(new MessageDTO("id", guildId, channelId, currentUser.id, message))
	}

	const receiveMessage = (
		userId: string,
		message: string,
		guildId: string,
		channelId: string
	) => {
		currentUser.guilds.forEach((guild) => {
			if (guild.id === guildId) {
				guild.channels.forEach((channel) => {
					if (channel.id == channelId) {
						const newId = (channel.messages.length + 1).toString()
						channel.addMessage(
							new MessageDTO(newId, guildId, channelId, userId, message)
						)
					}
				})
			}
		})
	}

	return (
		<UserContext.Provider
			value={{
				isAuthenticated,
				currentUser,
				login,
				logout,
				register,
				sendWebSocketMessage,
				receivedMessage,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(UserContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}

function ProcessMessage(message: DataTransferObject) {
	return
}
