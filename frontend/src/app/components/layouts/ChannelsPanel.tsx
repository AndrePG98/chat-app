import { Button, ButtonGroup } from "@nextui-org/react"
import { useState } from "react"
import { ChannelDTO } from "../../DTOs/ChannelDTO"
import CreateChannelModal from "../shared/CreateChannelModal"
import TextChannelBtn from "../shared/TextChannelBtn"
import VoiceChannelBtn from "../shared/VoiceChannelBtn"

export default function ChannelsPanel(props: { channels: ChannelDTO[] }) {
	const [modalOpen, setModalOpen] = useState(false)

	function openModal() {
		setModalOpen(true)
	}

	function closeModal() {
		setModalOpen(false)
	}

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
							<TextChannelBtn channelName={channel.name} channelId={channel.id} />
						)}
						{channel.type === "voice" && (
							<VoiceChannelBtn channelName={channel.name} channelId={channel.id} />
						)}
					</div>
				))}
			</div>
			<div className="user-buttons">
				<CreateChannelModal isOpen={modalOpen} onOpenChange={closeModal} />
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
						<span className="material-symbols-outlined">add</span>
					</Button>
				</ButtonGroup>
			</div>
		</div>
	)
}
