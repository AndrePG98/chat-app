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
import { useAuth } from "../contexts/authContext"

export default function Register() {
	const { register } = useAuth()
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const [userIdInput, setUserIdInput] = useState("")
	const [userNameInput, setUserNameInput] = useState("")
	const [userGuildsInput, setUserGuildsInput] = useState("")

	const handleRegister = () => {
		register(parseInt(userIdInput), userNameInput, userGuildsInput.split(" "))
	}

	return (
		<div>
			<Modal isOpen={isOpen} placement="center">
				<ModalContent>
					<>
						<ModalHeader className="flex flex-col gap-1">Register User</ModalHeader>
						<ModalBody>
							<Input
								label="userId"
								value={userIdInput}
								onValueChange={setUserIdInput}
							></Input>
							<Input
								label="userName"
								value={userNameInput}
								onValueChange={setUserNameInput}
							></Input>
							<Input
								label="guilds"
								value={userGuildsInput}
								onValueChange={setUserGuildsInput}
							></Input>
						</ModalBody>
						<ModalFooter>
							<Button
								onPress={() => {
									handleRegister()
									setIsOpen(false)
								}}
							>
								Create User
							</Button>
						</ModalFooter>
					</>
				</ModalContent>
			</Modal>
		</div>
	)
}
