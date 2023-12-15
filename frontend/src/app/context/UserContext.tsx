import { createContext, useContext, useEffect, useState } from "react"
import { AccessResult, LoginBroadcast, SenderDTO, UserDTO } from "../DTOs/UserDTO"
import { LoginEvent, RegisterEvent } from "../DTOs/UserDTO"
import { IEvent, ResultType } from "../DTOs/Types"
import useWebSocket from "../services/WebSocketService"
import { GuildDTO, JoinGuildResult } from "../DTOs/GuildDTO"
import { ChatMessageBroadcast, MessageDTO, SendMessageEvent } from "../DTOs/MessageDTO"
import { ChannelDTO, CreateChannelBroadcast, CreateChannelEvent } from "../DTOs/ChannelDTO"

interface UserContextProps {
	isAuthenticated: boolean
	currentUser: UserDTO
	login: (username: string, password: string, token: string) => void
	logout: () => void
	register: (username: string, password: string, email: string) => void
	receivedMessage: IEvent
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
			disconnectFromWs()
		}
	}, [])

	useEffect(() => {
		switch (receivedMessage.type) {
			case ResultType.R_Acess:
				authenticate(receivedMessage)
				break
			case ResultType.B_Login:
				processLoginBroadcast(receivedMessage)
				break
			case ResultType.B_Logout:
				processLogoutBroadcast(receivedMessage.body.userId)
				break
			case ResultType.R_JoinGuild:
				processGuildJoin(receivedMessage)
				break
			case ResultType.B_CreateChannel:
				processChannelCreate(receivedMessage)
				break
			case ResultType.B_ChatMessage:
				receiveMessage(receivedMessage)
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

	const authenticate = (msg: AccessResult) => {
		const user = new UserDTO(
			msg.body.userId,
			msg.body.username,
			"Email",
			"https://source.unsplash.com/random/?avatar"
		)
		localStorage.setItem("token", msg.body.token)
		if (msg.body.state !== null) {
			// read state param and fill the data
			proccessInitialState(msg.body.state, user)
			//const testguild = new GuildDTO("1", "Test Guild", id)
			//testguild.addChannel(new ChannelDTO("1", "Test Channel", "text"))
			//user.joinGuild(testguild)
		}
		setCurrentUser(user)
		setIsAuthenticated(true)
	}

	const proccessInitialState = (state: GuildDTO[], user: UserDTO) => {
		user.joinGuilds(state)
	}

	const login = async (username: string, password: string, token: string) => {
		connectToWs((connected: boolean) => {
			if (connected) {
				sendWebSocketMessage(new LoginEvent(username, password, token))
			}
		})
	}

	const logout = () => {
		disconnectFromWs()
		setIsAuthenticated(false)
		setCurrentUser(new UserDTO("", "", "", ""))
		localStorage.removeItem("token")
	}

	const receiveMessage = (msg: ChatMessageBroadcast) => {
		const newMsg = msg.body.message
		currentUser.guilds.forEach((guild) => {
			if (guild.guildId === newMsg.guildId) {
				guild.channels.forEach((channel) => {
					if (channel.channelId == newMsg.channelId) {
						channel.history = [...channel.history, newMsg]
					}
				})
			}
		})
	}

	const processLoginBroadcast = (msg: LoginBroadcast) => {
		const user = msg.body.user
		currentUser.guilds.forEach((guild) => {
			if (msg.body.guildIds.includes(guild.guildId)) {
				guild.addMember(user)
			}
		})
	}

	const processLogoutBroadcast = (id: string) => {
		currentUser.getGuilds().forEach((guild) => {
			guild.members = guild.members.filter((member) => member.userId != id)
		})
	}

	const processGuildJoin = (msg: JoinGuildResult) => {
		console.log(msg)
		currentUser.joinGuild(msg.body.guild)
	}

	const processChannelCreate = (msg: CreateChannelBroadcast) => {
		const channel = new ChannelDTO(
			msg.body.channelId,
			msg.body.guildId,
			msg.body.channelName,
			msg.body.channelType,
			[],
			[]
		)
		currentUser.guilds.forEach((guild) => {
			if (channel.guildId === guild.guildId) {
				guild.channels = [...guild.channels, channel]
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
