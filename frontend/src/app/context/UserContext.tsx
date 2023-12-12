import { createContext, useContext, useEffect, useState } from "react"
import { UserDTO } from "../DTOs/UserDTO"
import { Event, LoginEvent, RegisterEvent } from "../DTOs/Events"
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
	receivedMessage: Event
	sendWebSocketMessage: (data: any) => void
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserContextProvider = ({ children }: any) => {
	const [currentUser, setCurrentUser] = useState(new UserDTO("", "", "", ""))
	const { connectToWs, disconnectFromWs, sendWebSocketMessage, receivedMessage } = useWebSocket() // only available inside user context
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	const [changeFlag, setChangeFlag] = useState(false)

	useEffect(() => {
		switch (receivedMessage.type) {
			case 0:
				authenticate(
					receivedMessage.body.userId,
					receivedMessage.body.userName,
					receivedMessage.body.state
				)
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
		setChangeFlag(!changeFlag)
	}, [receivedMessage])

	const register = (username: string, password: string, email: string) => {
		connectToWs((connected: boolean) => {
			if (connected) {
				sendWebSocketMessage(new RegisterEvent(username, password, email))
			}
		})
	}

	const authenticate = (id: string, userName: string, guilds: string[]) => {
		const user = new UserDTO(
			id,
			userName,
			"Email",
			"https://source.unsplash.com/random/?avatar"
		)
		guilds.forEach((guildId) => {
			const newGuild = new GuildDTO(guildId, "GuildName")
			user.joinGuild(newGuild)
		})
		setCurrentUser(user)
		setIsAuthenticated(true)
	}

	const login = async (username: string, password: string) => {
		connectToWs((connected: boolean) => {
			if (connected) {
				sendWebSocketMessage(new LoginEvent(username, password))
			}
		})
	}

	const logout = () => {
		disconnectFromWs(currentUser.id)
	}

	const receiveMessage = (
		userId: string,
		message: string,
		guildId: string,
		channelId: string
	) => {
		console.log("here")

		currentUser.guilds.forEach((guild) => {
			if (guild.id === guildId) {
				guild.channels.forEach((channel) => {
					if (channel.id == channelId) {
						const newId = (channel.messages.length + 1).toString()
						const newMessage = new MessageDTO(
							newId,
							guildId,
							channelId,
							userId,
							message
						)
						channel.messages = [...channel.messages, newMessage]
						console.log(channel)
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

export const useUserContext = () => {
	const context = useContext(UserContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
