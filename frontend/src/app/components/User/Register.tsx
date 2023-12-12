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
import { useAuth } from "../../context/UserContext"

export default function Register() {
	const { register } = useAuth()
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const [userPasswordInput, setUserPasswordInput] = useState("")
	const [userNameInput, setUserNameInput] = useState("")
	const [userEmailInput, setUserEmailInput] = useState("")

	const handleRegister = () => {
		register(userNameInput, userPasswordInput, userEmailInput)
	}

	return (
		<div>
			<Modal isOpen={isOpen} placement="center">
				<ModalContent>
					<>
						<ModalHeader className="flex flex-col gap-1">Register User</ModalHeader>
						<ModalBody>
							<Input
								label="Email"
								value={userEmailInput}
								onValueChange={setUserEmailInput}
							></Input>
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
