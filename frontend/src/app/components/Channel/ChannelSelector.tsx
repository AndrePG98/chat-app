import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Modal,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
	Tooltip,
} from "@nextui-org/react"
import { useEffect, useState } from "react"
import {
	ChannelDTO,
	JoinChannelEvent,
	JoinNewChannelEvent,
	LeaveChannelEvent,
} from "../../DTOs/ChannelDTO"
import TextChannelBtn from "./Text/TextChannelBtn"
import VoiceChannelBtn from "./Voice/VoiceChannelBtn"
import CreateChannelModal from "./CreateChannelModal"
import { useUserContext } from "@/app/context/UserContext"
import { SenderDTO } from "@/app/DTOs/UserDTO"
import "./chanSelectorstyle.css"
import { GuildDTO } from "@/app/DTOs/GuildDTO"

export default function ChannelSelector(props: {
	channels: ChannelDTO[]
	guild: GuildDTO
	createNewChannel: (name: string, type: string) => void
	deleteChannel: (channelId: string) => void
	selectChannel: (channel: ChannelDTO | undefined) => void
	leaveGuild: () => void
}) {
	const { currentUser, sendWebSocketMessage } = useUserContext()
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const [modalOpen, setModalOpen] = useState(false)
	const [currentChannel, setCurrentChannel] = useState<ChannelDTO>()
	const [isMute, setIsMute] = useState(false)
	const [isDeafen, setIsDeafen] = useState(false)

	useEffect(() => {
		setCurrentChannel(currentUser.currentChannel)
	}, [currentUser.currentChannel])

	const deleteChannel = (channelId: string) => {
		if (channelId === currentChannel?.channelId) {
			removeChannelUser(currentChannel)
		}
		props.deleteChannel(channelId)
	}

	const openModal = () => {
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
	}

	function addChannelUser(channel: ChannelDTO) {
		if (currentChannel?.channelId !== channel.channelId) {
			let member = currentUser.convert()
			if (currentUser.currentChannel) {
				let event = new JoinNewChannelEvent(member, currentUser.currentChannel, channel)
				sendWebSocketMessage(event)
			} else {
				let event = new JoinChannelEvent(member, channel.guildId, channel.channelId)
				sendWebSocketMessage(event)
			}
		}
	}

	function removeChannelUser(channel: ChannelDTO) {
		let event = new LeaveChannelEvent(currentUser.id, channel.guildId, channel.channelId)
		sendWebSocketMessage(event)
	}

	return (
		<div className="channel-list basis-64 grow-0 shrink-0 flex flex-col items-stretch border-r border-gray-800 bg-surface-100">
			<div className="title text-center p-3 mb-5">{props.guild.guildName}</div>
			<div className="channel-buttons flex-1 overflow-y-scroll">
				{props.channels.map((channel) => (
					<div key={channel.channelId}>
						{channel.channelType === "text" && (
							<TextChannelBtn
								channel={channel}
								selectChannel={props.selectChannel}
								deleteChannel={deleteChannel}
							/>
						)}
						{channel.channelType === "voice" && (
							<VoiceChannelBtn
								channel={channel}
								selectChannel={props.selectChannel}
								addChannelUser={addChannelUser}
								deleteChannel={deleteChannel}
							/>
						)}
					</div>
				))}
			</div>
			<div className="user-buttons flex flex-col justify-evenly gap-2">
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
				<div className="flex flex-row pb-3">
					<Button
						radius="none"
						variant="light"
						isIconOnly
						onPress={openModal}
						className="flex justify-center items-center w-full"
					>
						<span className="material-symbols-outlined">add_comment</span>
					</Button>
					<Dropdown className="bg-surface-200 border-2 border-surface-100">
						<DropdownTrigger>
							<Button
								radius="none"
								variant="light"
								isIconOnly
								className="flex justify-center items-center w-full"
							>
								<span className="material-symbols-outlined">settings</span>
							</Button>
						</DropdownTrigger>
						<DropdownMenu>
							<DropdownItem
								key="delete"
								className="text-danger"
								color="danger"
								variant="bordered"
								startContent={
									<span className="material-symbols-outlined">delete</span>
								}
								onPress={() => {
									onOpen()
								}}
							>
								{currentUser.id === props.guild.ownerId
									? "Delete Guild"
									: "Leave Guild"}
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					<Modal
						isOpen={isOpen}
						onOpenChange={onOpenChange}
						placement="center"
						className="bg-surface-200"
					>
						<ModalContent>
							{(onClose) => (
								<>
									<ModalHeader className="flex flex-col gap-1">
										{currentUser.id === props.guild.ownerId
											? "Delete Guild?"
											: "Leave Guild?"}
									</ModalHeader>
									<ModalFooter>
										<Button color="danger" variant="light" onPress={onClose}>
											Close
										</Button>
										<Button
											className="w-full"
											color="success"
											onClick={() => {
												onClose()
												props.leaveGuild()
											}}
											endContent={
												<span className="material-symbols-outlined">
													check
												</span>
											}
										>
											Confirm
										</Button>
									</ModalFooter>
								</>
							)}
						</ModalContent>
					</Modal>
				</div>
			</div>
		</div>
	)
}
