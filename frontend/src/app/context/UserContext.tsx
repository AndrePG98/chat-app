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
	login: (username: string, password: string, token: string) => void
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
		const token = localStorage.getItem("token")
		if (token) {
			connectToWs((connected: boolean) => {
				if (connected) {
					sendWebSocketMessage(new LoginEvent("", "", token))
				}
			})
		}
		return () => {
			disconnectFromWs(currentUser.id)
		}
	}, [])

	useEffect(() => {
		switch (receivedMessage.type) {
			case 0:
				authenticate(
					receivedMessage.body.userId,
					receivedMessage.body.token,
					receivedMessage.body.userName,
					receivedMessage.body.state
				)
				break
			case 1:
				const id = receivedMessage.body.userId
				const username = receivedMessage.body.username
				const email = receivedMessage.body.email
				const logo = receivedMessage.body.logo
				const guildIds: string[] = receivedMessage.body.guildIds
				currentUser.guilds.forEach((guild) => {
					if (guildIds.includes(guild.id)) {
						guild.addMember(new UserDTO(id, username, email, logo))
					}
				})
				break
			case 2:
				const userId = receivedMessage.body.userId
				currentUser.getGuilds().forEach((guild) => {
					guild.members = guild.members.filter((member) => member.id != userId)
				})
				break
			case 3:
				receiveMessage(
					receivedMessage.body.message.sender.userId,
					receivedMessage.body.message.content,
					receivedMessage.body.message.guildId,
					receivedMessage.body.message.channelId
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

	const authenticate = (id: string, token: string, userName: string, state: any[]) => {
		const user = new UserDTO(
			id,
			userName,
			"Email",
			"https://source.unsplash.com/random/?avatar"
		)
		localStorage.setItem("token", token)
		if (state !== null) {
			// read state param and fill the data
			const testguild = new GuildDTO("1", "Test Guild", id)
			testguild.addChannel(new ChannelDTO("1", "Test Channel", "text"))
			user.joinGuild(testguild)
		}
		setCurrentUser(user)
		setIsAuthenticated(true)
	}

	const login = async (username: string, password: string, token: string) => {
		connectToWs((connected: boolean) => {
			if (connected) {
				sendWebSocketMessage(new LoginEvent(username, password, token))
			}
		})
	}

	const logout = () => {
		disconnectFromWs(currentUser.id)
		setIsAuthenticated(false)
		setCurrentUser(new UserDTO("", "", "", ""))
		localStorage.removeItem("token")
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
						const newMessage = new MessageDTO(
							newId,
							guildId,
							channelId,
							userId,
							message
						)
						channel.messages = [...channel.messages, newMessage]
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
