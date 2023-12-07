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
import { useAuth } from "../contexts/authContext"
import useConnectService from "../services/connectService"

export default function Login() {
	const { login, authenticated, currentUser } = useAuth()
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const [userIdInput, setUserIdInput] = useState("")
	const [userNameInput, setUserNameInput] = useState("")
	const [userGuildsInput, setUserGuildsInput] = useState("")

	const handleLogin = (userIdInput: number, userNameInput: string, userGuildsInput: string[]) => {
		login(userIdInput, userNameInput, userGuildsInput)
	}

	useConnectService(currentUser)
	if (authenticated) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
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
										parseInt(userIdInput),
										userNameInput,
										userGuildsInput.split(" ")
									)
									setIsOpen(false)
									// eslint-disable-next-line react-hooks/rules-of-hooks
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
