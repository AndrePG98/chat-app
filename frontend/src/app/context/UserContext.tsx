import { createContext, useContext, useEffect, useState } from "react"
import { AccessResult, LoginBroadcast, SenderDTO, UserDTO } from "../DTOs/UserDTO"
import { LoginEvent, RegisterEvent } from "../DTOs/UserDTO"
import { IEvent, ResultType } from "../DTOs/Types"
import useWebSocket from "../services/WebSocketService"
import {
	GuildDTO,
	GuildDeleteBroadcast,
	JoinGuildBroadcast,
	JoinGuildResult,
	LeaveGuildBroadcast,
	LeaveGuildResult,
} from "../DTOs/GuildDTO"
import {
	ChatMessageBroadcast,
	DeleteMessageBroadcast,
	MessageDTO,
	SendMessageEvent,
} from "../DTOs/MessageDTO"
import {
	ChannelDTO,
	CreateChannelBroadcast,
	CreateChannelEvent,
	DeleteChannelBroadcast,
	JoinChannelBroadcast,
	LeaveCHannelBroadcast,
} from "../DTOs/ChannelDTO"

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
			case ResultType.R_JoinGuild:
				processGuildJoinResult(receivedMessage)
				break
			case ResultType.R_LeaveGuild:
				processGuildLeaveResult(receivedMessage)
				break
			case ResultType.B_Login:
				processLoginBroadcast(receivedMessage)
				break
			case ResultType.B_Logout:
				processLogoutBroadcast(receivedMessage.body.userId)
				break
			case ResultType.B_GuildDelete:
				processGuildDeleteBroadcast(receivedMessage)
				break
			case ResultType.B_GuildJoin:
				processGuildJoinBroadcast(receivedMessage)
				break
			case ResultType.B_GuildLeave:
				processGuildLeaveBroadcast(receivedMessage)
				break
			case ResultType.B_CreateChannel:
				processChannelCreateBroadcast(receivedMessage)
				break
			case ResultType.B_DeleteChannel:
				processChannelDeleteBroadcast(receivedMessage)
				break
			case ResultType.B_JoinChannel:
				processChannelJoinBroadcast(receivedMessage)
				break
			case ResultType.B_LeaveChannel:
				processChannelLeaveBroadcast(receivedMessage)
				break
			case ResultType.B_ChatMessage:
				processMessageBroadcast(receivedMessage)
				break
			case ResultType.B_ChatMessageDelete:
				processMessageDeleteBroadcast(receivedMessage)
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

	const login = async (username: string, password: string, token: string) => {
		connectToWs((connected: boolean) => {
			if (connected) {
				sendWebSocketMessage(new LoginEvent(username, password, token))
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
			proccessInitialState(msg.body.state, user)
		}
		setCurrentUser(user)
		setIsAuthenticated(true)
	}

	const proccessInitialState = (state: GuildDTO[], user: UserDTO) => {
		user.joinGuilds(state)
	}

	const logout = () => {
		disconnectFromWs()
		setIsAuthenticated(false)
		setCurrentUser(new UserDTO("", "", "", ""))
		localStorage.removeItem("token")
	}

	const processGuildJoinResult = (msg: JoinGuildResult) => {
		currentUser.joinGuild(msg.body.guild)
	}

	const processGuildLeaveResult = (msg: LeaveGuildResult) => {
		currentUser.leaveGuild(msg.body.guildId)
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

	const processGuildDeleteBroadcast = (msg: GuildDeleteBroadcast) => {
		currentUser.leaveGuild(msg.body.guildId)
	}

	const processGuildJoinBroadcast = (msg: JoinGuildBroadcast) => {
		currentUser.guilds.forEach((guild) => {
			if (guild.guildId === msg.body.guildId) {
				guild.addMember(msg.body.user)
			}
		})
	}

	const processGuildLeaveBroadcast = (msg: LeaveGuildBroadcast) => {
		currentUser.guilds.forEach((guild) => {
			if (guild.guildId === msg.body.guildId) {
				guild.removeMember(msg.body.userId)
			}
		})
	}

	const processChannelCreateBroadcast = (msg: CreateChannelBroadcast) => {
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

	const processChannelDeleteBroadcast = (msg: DeleteChannelBroadcast) => {
		currentUser.guilds.forEach((guild) => {
			if (guild.guildId === msg.body.guildId) {
				guild.channels = guild.channels.filter((chan) => {
					return chan.channelId != msg.body.channelId
				})
			}
		})
	}

	const processChannelJoinBroadcast = (msg: JoinChannelBroadcast) => {
		currentUser.guilds.forEach((guild) => {
			if (guild.guildId === msg.body.guildId) {
				guild.channels.forEach((chan) => {
					if (chan.hasMember(currentUser.id)) {
						console.log("Inside channel", chan)
						chan.leaveChannel(currentUser.id)
					}
					if (chan.channelId === msg.body.channelId) {
						chan.joinChannel(msg.body.user)
					}
				})
			}
		})
	}

	const processChannelLeaveBroadcast = (msg: LeaveCHannelBroadcast) => {
		currentUser.guilds.forEach((guild) => {
			if (guild.guildId === msg.body.guildId) {
				guild.channels.forEach((chan) => {
					if (chan.channelId === msg.body.channelId) {
						chan.leaveChannel(msg.body.userId)
					}
				})
			}
		})
	}

	const processMessageBroadcast = (msg: ChatMessageBroadcast) => {
		currentUser.guilds.forEach((guild) => {
			if (guild.guildId === msg.body.message.guildId) {
				guild.channels.forEach((channel) => {
					if (channel.channelId === msg.body.message.channelId) {
						console.log(channel)
						channel.addMessage(msg.body.message)
					}
				})
			}
		})
	}

	const processMessageDeleteBroadcast = (msg: DeleteMessageBroadcast) => {
		currentUser.guilds.forEach((guild) => {
			if (guild.guildId === msg.body.guildId) {
				guild.channels.forEach((channel) => {
					if (channel.channelId === msg.body.channelId) {
						console.log(channel)
						channel.removeMessage(msg.body.messageId)
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
