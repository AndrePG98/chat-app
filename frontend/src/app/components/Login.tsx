"use client"

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
import { useAuth } from "../context/authContext"

export default function Login() {
	const { login } = useAuth()
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const [userIdInput, setUserIdInput] = useState("")
	const [userNameInput, setUserNameInput] = useState("")
	const [userGuildsInput, setUserGuildsInput] = useState("")

	const handleLogin = (userIdInput: string, userNameInput: string, userGuildsInput: string[]) => {
		login(userIdInput, userNameInput, userGuildsInput)
	}

	return (
		<div>
			<Modal isOpen={isOpen} placement="center">
				<ModalContent>
					<>
						<ModalHeader className="flex flex-col gap-1">Login User</ModalHeader>
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
									handleLogin(
										userIdInput,
										userNameInput,
										userGuildsInput.split(" ")
									)
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
