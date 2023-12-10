import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react"
import { useState } from "react"

export default function CreateServerModal(props: {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	createNewServer: (name: string) => void
}) {
	const [serverName, setServerName] = useState("")

	return (
		<Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} placement="center">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							What&apos;s the Server name?
						</ModalHeader>
						<ModalBody>
							<Input
								type="name"
								label="Channel Name"
								placeholder="Enter the desired server name"
								value={serverName}
								onChange={(e) => setServerName(e.target.value)}
							/>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Close
							</Button>
							<Button
								className="w-full"
								color="success"
								onClick={() => {
									onClose()
									props.createNewServer(serverName)
									setServerName("")
								}}
								endContent={<span className="material-symbols-outlined">add</span>}
							>
								Create server
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
