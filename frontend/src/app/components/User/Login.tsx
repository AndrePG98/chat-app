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
import { useEffect, useState } from "react"
import { useUserContext } from "../../context/UserContext"

export default function Login(props: { onClose: () => void }) {
	const { login, error, resetError } = useUserContext()
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const [userPasswordInput, setUserPasswordInput] = useState("")
	const [userNameInput, setUserNameInput] = useState("")
	const [threwError, setThrewError] = useState(false)

	const handleLogin = (userName: string, userPassword: string) => {
		login(userName, userPassword, "")
	}

	useEffect(() => {
		if (error === "error bad credentials: sql: no rows in result set") {
			setThrewError(true)
		} else {
			setThrewError(false)
		}
	}, [error])

	return (
		<div>
			<Modal
				isOpen={isOpen}
				placement="center"
				className="bg-surface-200"
				onOpenChange={() => {
					if (!isOpen) {
						resetError()
						props.onClose()
					}
				}}
			>
				<ModalContent>
					<>
						<ModalHeader className="flex flex-col gap-1 justify-center items-center">
							Login User
						</ModalHeader>
						<ModalBody className="flex flex-col justify-center items-center">
							<Input
								isInvalid={threwError}
								size="lg"
								color={threwError ? "danger" : "default"}
								errorMessage={threwError && "Incorrect username"}
								label="Username"
								labelPlacement="outside"
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
								size="lg"
								labelPlacement="outside"
								isInvalid={threwError}
								color={threwError ? "danger" : "default"}
								errorMessage={threwError && "Incorrect password"}
								type="password"
								label="Password"
								value={userPasswordInput}
								onValueChange={setUserPasswordInput}
							></Input>
						</ModalBody>
						<ModalFooter className="flex flex-row items-center justify-betweens">
							<Button
								className="bg-surface-400"
								color="danger"
								onPress={() => {
									resetError()
									props.onClose()
								}}
							>
								Back
							</Button>
							<Button
								className="bg-surface-400"
								onPress={() => {
									resetError()
									handleLogin(userNameInput, userPasswordInput)
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
