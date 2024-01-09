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
import { useUserContext } from "../../context/UserContext"

export default function Register(props: { onClose: () => void }) {
	const { register } = useUserContext()
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const [userPasswordInput, setUserPasswordInput] = useState("")
	const [userNameInput, setUserNameInput] = useState("")
	const [userEmailInput, setUserEmailInput] = useState("")

	const handleRegister = () => {
		register(userNameInput, userPasswordInput, userEmailInput)
	}

	const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)

	const isInvalid = React.useMemo(() => {
		if (userEmailInput === "") return false

		return validateEmail(userEmailInput) ? false : true
	}, [userEmailInput])

	return (
		<div>
			<Modal
				isOpen={isOpen}
				onOpenChange={props.onClose}
				placement="center"
				className="bg-surface-200"
			>
				<ModalContent>
					<>
						<ModalHeader className="flex flex-col gap-1">Register User</ModalHeader>
						<ModalBody>
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
								labelPlacement="outside"
								isInvalid={isInvalid}
								color={isInvalid ? "danger" : "default"}
								errorMessage={isInvalid && "Please enter a valid email"}
								label="Email"
								value={userEmailInput}
								onValueChange={setUserEmailInput}
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
								labelPlacement="outside"
								label="Username"
								value={userNameInput}
								onValueChange={setUserNameInput}
							></Input>
							<Input
								labelPlacement="outside"
								type="password"
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
						<ModalFooter className="flex flex-row items-center justify-between">
							<Button
								className="bg-surface-400"
								onPress={() => {
									props.onClose()
								}}
							>
								Back
							</Button>
							<Button
								className="bg-surface-400"
								onPress={() => {
									handleRegister()
									props.onClose()
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
