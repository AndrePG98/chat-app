import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react"
import React, { useState } from "react"
import withDelayedClick from "../shared/DisableOnClickBtn"

export default function CreateGuildModal(props: {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	createNewGuild: (name: string) => void
}) {
	const [guildName, setGuildName] = useState("")

	const btn = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
		<Button
			className="w-full"
			color="success"
			endContent={<span className="material-symbols-outlined">add</span>}
			onClick={props.onClick}
		>
			Create Server
		</Button>
	)

	const CreateGuildBtn = withDelayedClick(btn)

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
							What should the server be called?
						</ModalHeader>
						<ModalBody>
							<Input
								disableAnimation
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
								type="name"
								label="Server Name"
								placeholder="Enter the desired server name"
								value={guildName}
								onChange={(e) => setGuildName(e.target.value)}
							/>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Close
							</Button>
							<CreateGuildBtn
								onClick={() => {
									onClose()
									props.createNewGuild(guildName)
									setGuildName("")
									setGuildName("")
								}}
							/>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
