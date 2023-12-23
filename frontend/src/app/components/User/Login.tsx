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
			<Modal isOpen={isOpen} placement="center" className="bg-surface-200">
				<ModalContent>
					<>
						<ModalHeader className="flex flex-col gap-1">Login User</ModalHeader>
						<ModalBody>
							<Input
								label="Username"
								value={userNameInput}
								onValueChange={setUserNameInput}
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
							></Input>
							<Input
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
								label="Password"
								value={userPasswordInput}
								onValueChange={setUserPasswordInput}
							></Input>
						</ModalBody>
						<ModalFooter>
							<Button
								className="bg-surface-400"
								onPress={() => {
									handleLogin(userNameInput, userPasswordInput)
									setIsOpen(false)
								}}
							>
								Log in
							</Button>
						</ModalFooter>
					</>
				</ModalContent>
			</Modal>
		</div>
	)
}
