import { createContext, useContext, useEffect, useState } from "react"
import {
	LoginEvent,
	RegisterEvent,
	AccessResult,
	DeafenBroadcast,
	LoginBroadcast,
	MuteBroadcast,
	SenderDTO,
	UploadLogoBroadcast,
	UploadLogoResult,
	UserDTO,
	InvitationResult,
	Invite,
} from "../DTOs/UserDTO"
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
import { ChatMessageBroadcast, DeleteMessageBroadcast } from "../DTOs/MessageDTO"
import {
	ChannelDTO,
	CreateChannelBroadcast,
	DeleteChannelBroadcast,
	JoinChannelBroadcast,
	LeaveCHannelBroadcast,
} from "../DTOs/ChannelDTO"
import useWebRTC from "../services/WebRTCService"

interface UserContextProps {
	isAuthenticated: boolean
	currentUser: UserDTO
	login: (username: string, password: string, token: string) => void
	logout: () => void
	register: (username: string, password: string, email: string) => void
	receivedMessage: IEvent
	sendWebSocketMessage: (data: any) => void
	connectToRTC: (userId: string, channelId: string, guildId: string) => void
	disconnectRTC: () => void
	controls: { toggleMute: () => boolean; toggleDeafen: () => boolean }
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserContextProvider = ({ children }: any) => {
	const [currentUser, setCurrentUser] = useState(new UserDTO("", "", "", "", false, false))
	const { connectToWs, disconnectFromWs, sendWebSocketMessage, receivedMessage } = useWebSocket() // only available inside user context
	const { connectToRTC, disconnectRTC, controls } = useWebRTC()
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

		window.addEventListener("beforeunload", (event) => {
			disconnectFromWs(currentUser.id)
			setIsAuthenticated(false)
			setCurrentUser(new UserDTO("", "", "", "", false, false))
		})

		return () => {
			window.removeEventListener("beforeunload", (event) => {
				disconnectFromWs(currentUser.id)
				setIsAuthenticated(false)
				setCurrentUser(new UserDTO("", "", "", "", false, false))
			})
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
			case ResultType.R_UploadLogo:
				processUploadLogoResult(receivedMessage)
				break
			case ResultType.B_UploadLogo:
				processUploadLogoBroadcast(receivedMessage)
				break
			case ResultType.B_Mute:
				processMuteBroadcast(receivedMessage)
				break
			case ResultType.B_Deafen:
				processDeafenBroadcast(receivedMessage)
				break
			case ResultType.R_Invitation:
				processInvitation(receivedMessage)
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
		if (msg.body.error.length === 0) {
			const user = new UserDTO(
				msg.body.userId,
				msg.body.username,
				msg.body.email,
				msg.body.logo,
				msg.body.ismuted,
				msg.body.isdeafen
			)
			localStorage.setItem("token", msg.body.token)
			if (msg.body.state !== null) {
				user.guilds = msg.body.state
			}
			if (msg.body.invites !== null) {
				user.invites = msg.body.invites
			}
			setCurrentUser(user)
			setIsAuthenticated(true)
		}
	}

	const logout = () => {
		disconnectFromWs(currentUser.id)
		setIsAuthenticated(false)
		setCurrentUser(new UserDTO("", "", "", "", false, false))
		localStorage.removeItem("token")
	}

	const processGuildJoinResult = (msg: JoinGuildResult) => {
		currentUser.guilds.push(msg.body.guild)
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
		if (currentUser.selectedGuild?.guildId === msg.body.guildId) {
			currentUser.selectedGuild = undefined
		}
	}

	const processGuildJoinBroadcast = (msg: JoinGuildBroadcast) => {
		currentUser.guilds.forEach((guild) => {
			if (guild.guildId === msg.body.guildId) {
				guild.members.push(msg.body.user)
			}
		})
	}

	const processGuildLeaveBroadcast = (msg: LeaveGuildBroadcast) => {
		currentUser.guilds.forEach((guild) => {
			if (guild.guildId === msg.body.guildId) {
				guild.members = guild.members.filter((member) => {
					return member.userId !== msg.body.userId
				})
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
					if (chan.channelId === msg.body.channelId) {
						chan.members.push(msg.body.user)
						if (msg.body.user.userId === currentUser.id) {
							currentUser.currentChannel = chan
						}
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
						var newMembersList: SenderDTO[] = []
						chan.members.forEach((member) => {
							if (member.userId !== msg.body.userId) {
								newMembersList.push(member)
							}
						})
						chan.members = newMembersList
					}
				})
			}
		})
		if (currentUser.id === msg.body.userId) {
			currentUser.currentChannel = undefined
		}
	}

	const processMessageBroadcast = (msg: ChatMessageBroadcast) => {
		currentUser.guilds.forEach((guild) => {
			if (guild.guildId === msg.body.message.guildId) {
				guild.channels.forEach((channel) => {
					if (channel.channelId === msg.body.message.channelId) {
						channel.history.push(msg.body.message)
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
						for (let i = 0; i < channel.history.length; i++) {
							if (channel.history[i].messageId === msg.body.messageId) {
								channel.history.splice(i, 1)
							}
						}
					}
				})
			}
		})
	}

	const processUploadLogoResult = (msg: UploadLogoResult) => {
		currentUser.logo = msg.body.image
	}

	const processUploadLogoBroadcast = (msg: UploadLogoBroadcast) => {
		msg.body.guildIds.forEach((guildId) => {
			const guild = currentUser.getGuild(guildId)
			if (guild) {
				guild.members.forEach((member) => {
					if (member.userId === msg.body.userId) {
						member.logo = msg.body.image
					}
				})
				guild.channels.forEach((channel) => {
					if (channel.channelType === "voice") {
						channel.members.forEach((user) => {
							if (user.userId === msg.body.userId) {
								user.logo = msg.body.image
							}
						})
					} else {
						channel.history.forEach((message) => {
							if (message.sender.userId === msg.body.userId) {
								message.sender.logo = msg.body.image
							}
						})
					}
				})
			}
		})
	}

	const processMuteBroadcast = (msg: MuteBroadcast) => {
		const guild = currentUser.getGuild(msg.body.guildId)
		if (guild) {
			guild.channels.forEach((chan) => {
				if (chan.channelId === msg.body.channelId) {
					chan.members.forEach((member) => {
						if (member.userId === msg.body.userId) {
							member.ismuted = msg.body.ismuted
							member = member
						}
					})
				}
			})
		}
	}

	const processDeafenBroadcast = (msg: DeafenBroadcast) => {
		const guild = currentUser.getGuild(msg.body.guildId)
		if (guild) {
			guild.channels.forEach((chan) => {
				if (chan.channelId === msg.body.channelId) {
					chan.members.forEach((member) => {
						if (member.userId === msg.body.userId) {
							member.isdeafen = msg.body.isdeafen
							member = member
						}
					})
				}
			})
		}
	}

	const processInvitation = (msg: InvitationResult) => {
		currentUser.invites.push(msg.body.invite)
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
				connectToRTC,
				disconnectRTC,
				controls,
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
