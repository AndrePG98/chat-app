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
import { useState } from "react"
import { ChannelDTO, JoinChannelEvent, LeaveChannelEvent } from "../../DTOs/ChannelDTO"
import TextChannelBtn from "./Text/TextChannelBtn"
import VoiceChannelBtn from "./Voice/VoiceChannelBtn"
import CreateChannelModal from "./CreateChannelModal"
import { useUserContext } from "@/app/context/UserContext"
import { SenderDTO } from "@/app/DTOs/UserDTO"
import "./chanSelectorstyle.css"

export default function ChannelSelector(props: {
	channels: ChannelDTO[]
	serverName: string
	createNewChannel: (name: string, type: string) => void
	deleteChannel: (channelId: string) => void
	selectChannel: (channel: ChannelDTO) => void
	leaveGuild: () => void
}) {
	const { currentUser, sendWebSocketMessage } = useUserContext()
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const [modalOpen, setModalOpen] = useState(false)
	const [currentChannel, setCurrentChannel] = useState<ChannelDTO>()
	const [isMute, setIsMute] = useState(false)
	const [isDeafen, setIsDeafen] = useState(false)

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
		<div className="channel-list basis-64 grow-0 shrink-0 flex flex-col items-stretch border-r border-gray-800 bg-surface-100">
			<div className="title text-center p-3 mb-5">{props.serverName}</div>
			<div className="channel-buttons flex-1">
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
				<div className="flex flex-row pb-3">
					<button
						onClick={openModal}
						className="flex justify-center items-center w-full chan-selector-btn"
					>
						<span className="material-symbols-outlined">add_comment</span>
					</button>
					<Dropdown showArrow>
						<DropdownTrigger>
							<button className="flex justify-center items-center w-full chan-selector-btn">
								<span className="material-symbols-outlined">settings</span>
							</button>
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
								Leave guild
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
						<ModalContent>
							{(onClose) => (
								<>
									<ModalHeader className="flex flex-col gap-1">
										Leave guild?
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

{
	/* <Dropdown className="py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black">
	<DropdownTrigger>
		<Button
			variant="light"
			radius="lg"
			isIconOnly
			size="sm"
			className="flex justify-center items-center"
		>
			<span className="material-symbols-outlined">menu</span>
		</Button>
	</DropdownTrigger>
	<DropdownMenu>
		<DropdownItem
			key="delete"
			className="text-danger"
			color="danger"
			startContent={<span className="material-symbols-outlined">delete</span>}
			onPress={() => {
				onOpen()
			}}
		>
			Leave guild
		</DropdownItem>
	</DropdownMenu>
</Dropdown> */
}
