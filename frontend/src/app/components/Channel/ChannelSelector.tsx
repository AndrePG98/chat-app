import { Button, ButtonGroup } from "@nextui-org/react"
import { useState } from "react"
import { ChannelDTO } from "../../DTOs/ChannelDTO"
import TextChannelBtn from "./Text/TextChannelBtn"
import VoiceChannelBtn from "./Voice/VoiceChannelBtn"
import CreateChannelModal from "./CreateChannelModal"

export default function ChannelSelector(props: {
	channels: ChannelDTO[]
	createNewChannel: (name: string, type: string) => void
	selectChannel: (channel: ChannelDTO) => void
}) {
	const [modalOpen, setModalOpen] = useState(false)

	function openModal() {
		setModalOpen(true)
	}

	function closeModal() {
		setModalOpen(false)
	}

	const addIcon = <span className="material-symbols-outlined">add</span>

	return (
		<div
			className="channel-list w-64 flex flex-col items-stretch"
			style={{ border: "2px solid red" }}
		>
			<div className="title text-center p-3 mb-5">SERVER NAME</div>
			<div className="channel-buttons flex-1">
				{props.channels.map((channel) => (
					<div key={channel.id}>
						{channel.type === "text" && (
							<TextChannelBtn channel={channel} selectChannel={props.selectChannel} />
						)}
						{channel.type === "voice" && (
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
				<ButtonGroup
					variant="light"
					className="flex flex-row w-full"
					radius="none"
					size="sm"
					fullWidth
				>
					<Button
						isIconOnly
						className="flex justify-center items-center w-full"
						onClick={openModal}
					>
						{addIcon}
					</Button>
				</ButtonGroup>
			</div>
		</div>
	)
}
