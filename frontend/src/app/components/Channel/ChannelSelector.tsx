import { Button, ButtonGroup } from "@nextui-org/react"
import { useState } from "react"
import { ChannelDTO } from "../../DTOs/ChannelDTO"
import TextChannelBtn from "./Text/TextChannelBtn"
import VoiceChannelBtn from "./Voice/VoiceChannelBtn"
import CreateChannelModal from "./CreateChannelModal"

export default function ChannelSelector(props: {
	channels: ChannelDTO[]
	serverName: string
	createNewChannel: (name: string, type: string) => void
	selectChannel: (channel: ChannelDTO) => void
}) {
	const [modalOpen, setModalOpen] = useState(false)

	const openModal = () => {
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
	}

	return (
		<div
			className="channel-list w-64 flex flex-col items-stretch"
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
							/>
						)}
					</div>
				))}
			</div>
			<div className="user-buttons">
				<CreateChannelModal
					isOpen={modalOpen}
					onOpenChange={closeModal}
					createNewChannel={props.createNewChannel}
				/>
				<Button
					fullWidth
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
