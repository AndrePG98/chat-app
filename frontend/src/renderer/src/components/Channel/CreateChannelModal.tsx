import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Radio,
	RadioGroup,
} from "@nextui-org/react"
import React, { useState } from "react"
import withDelayedClick from "../shared/DisableOnClickBtn"

export default function CreateChannelModal(props: {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	createNewChannel: (name: string, type: string) => void
}) {
	const [channelType, setChannelType] = React.useState("")
	const [channelName, setChannelName] = useState("")

	const btn = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
		<Button
			className="w-full"
			color="success"
			onClick={props.onClick}
			endContent={<span className="material-symbols-outlined">add</span>}
		>
			Create channel
		</Button>
	)

	const CreateChannelBtn = withDelayedClick(btn)

	return (
		<Modal
			isOpen={props.isOpen}
			onOpenChange={props.onOpenChange}
			placement="center"
			className="bg-surface-200"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							What&apos;s the channel type?
						</ModalHeader>
						<ModalBody>
							<RadioGroup value={channelType} onValueChange={setChannelType}>
								<Radio value="voice">Voice</Radio>
								<Radio value="text">Text</Radio>
							</RadioGroup>
						</ModalBody>
						<ModalHeader className="flex flex-col gap-1">
							What should the channel be called?
						</ModalHeader>
						<ModalBody>
							<Input
								type="name"
								classNames={{
									input: ["bg-transparent"],
									innerWrapper: "bg-transparent",
									inputWrapper: [
										"bg-surface-300 focus:bg-surface-300 active:bg-surface-300",
										"dark:bg-surface-300 focus:bg-surface-300 active:bg-surface-300",
										"hover:bg-surface-400 ",
										"dark:hover:bg-surface-400",
										"focus:bg-surface-400 active:bg-surface-400",
										"dark:focus:bg-surface-400 active:bg-surface-300",
										"!cursor-text",
									],
								}}
								label="Channel Name"
								placeholder="Enter the desired channel name"
								value={channelName}
								onChange={(e) => setChannelName(e.target.value)}
							/>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Close
							</Button>
							<CreateChannelBtn
								onClick={() => {
									onClose()
									props.createNewChannel(channelName, channelType)
									setChannelName("")
									setChannelType("")
								}}
							/>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
