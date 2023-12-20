import { Button, ButtonGroup } from "@nextui-org/react"
import { useState } from "react"
import { ChannelDTO, JoinChannelEvent, LeaveChannelEvent } from "../../DTOs/ChannelDTO"
import TextChannelBtn from "./Text/TextChannelBtn"
import VoiceChannelBtn from "./Voice/VoiceChannelBtn"
import CreateChannelModal from "./CreateChannelModal"
import { useUserContext } from "@/app/context/UserContext"
import { SenderDTO } from "@/app/DTOs/UserDTO"

export default function ChannelSelector(props: {
	channels: ChannelDTO[]
	serverName: string
	createNewChannel: (name: string, type: string) => void
	selectChannel: (channel: ChannelDTO) => void
}) {
	const { currentUser, sendWebSocketMessage } = useUserContext()
	const [modalOpen, setModalOpen] = useState(false)
	const [currentChannel, setCurrentChannel] = useState<ChannelDTO>()
	const [isMute, setIsMute] = useState(false)
	const [isDeafen, setIsDeafen] = useState(false)

	const openModal = () => {
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
	}

	function addChannelUser(channel: ChannelDTO) {
		if (currentChannel?.channelId !== channel.channelId) {
			let member = new SenderDTO(
				currentUser.id,
				currentUser.username,
				currentUser.email,
				currentUser.logo
			)
			let event = new JoinChannelEvent(member, channel.guildId, channel.channelId)
			sendWebSocketMessage(event)
			setCurrentChannel(channel)
		}
	}

	function removeChannelUser(channel: ChannelDTO) {
		if (currentChannel?.channelId === channel.channelId) {
			let event = new LeaveChannelEvent(currentUser.id, channel.guildId, channel.channelId)
			sendWebSocketMessage(event)
			setCurrentChannel(undefined)
		}
	}

	return (
		<div
			className="channel-list basis-64 grow-0 shrink-0 flex flex-col items-stretch"
			style={{ border: "2px solid red" }}
		>
			<div className="title text-center p-3 mb-5">{props.serverName}</div>
			<div className="channel-buttons flex-1">
				{props.channels.map((channel) => (
					<div key={channel.channelId}>
						{channel.channelType === "text" && (
							<TextChannelBtn channel={channel} selectChannel={props.selectChannel} />
						)}
						{channel.channelType === "voice" && (
							<VoiceChannelBtn
								channel={channel}
								selectChannel={props.selectChannel}
								addChannelUser={addChannelUser}
							/>
						)}
					</div>
				))}
			</div>
			<div className="user-buttons flex flex-col justify-evenly">
				<CreateChannelModal
					isOpen={modalOpen}
					onOpenChange={closeModal}
					createNewChannel={props.createNewChannel}
				/>
				<div className="flex flex-row">
					{currentChannel && (
						<>
							<Button
								size="sm"
								radius="none"
								variant="light"
								isIconOnly
								className="flex justify-center items-center w-full"
								onPress={() => setIsMute(!isMute)}
							>
								{isMute ? (
									<span className="material-symbols-outlined">mic_off</span>
								) : (
									<span className="material-symbols-outlined">mic</span>
								)}
							</Button>
							<Button
								size="sm"
								radius="none"
								variant="light"
								isIconOnly
								className="flex justify-center items-center w-full"
								onPress={() => setIsDeafen(!isDeafen)}
							>
								{isDeafen ? (
									<span className="material-symbols-outlined">volume_off</span>
								) : (
									<span className="material-symbols-outlined">volume_up</span>
								)}
							</Button>
							<Button
								size="sm"
								radius="none"
								variant="light"
								isIconOnly
								className="flex justify-center items-center w-full"
								onPress={() => removeChannelUser(currentChannel)}
							>
								<span className="material-symbols-outlined">close</span>
							</Button>
						</>
					)}
				</div>
				<Button
					size="sm"
					radius="none"
					variant="light"
					isIconOnly
					className="flex justify-center items-center w-full"
					onClick={openModal}
				>
					<span className="material-symbols-outlined">add</span>
				</Button>
			</div>
		</div>
	)
}
