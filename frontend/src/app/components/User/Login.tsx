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
import { useUserContext } from "../../context/UserContext"

export default function Login() {
	const { login } = useUserContext()
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const [userPasswordInput, setUserPasswordInput] = useState("")
	const [userNameInput, setUserNameInput] = useState("")

	const handleLogin = (userName: string, userPassword: string) => {
		login(userName, userPassword, "")
	}

	return (
		<div>
			<Modal isOpen={isOpen} placement="center">
				<ModalContent>
					<>
						<ModalHeader className="flex flex-col gap-1">Login User</ModalHeader>
						<ModalBody>
							<Input
								label="Username"
								value={userNameInput}
								onValueChange={setUserNameInput}
							></Input>
							<Input
								label="Password"
								value={userPasswordInput}
								onValueChange={setUserPasswordInput}
							></Input>
						</ModalBody>
						<ModalFooter>
							<Button
								onPress={() => {
									handleLogin(userNameInput, userPasswordInput)
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
