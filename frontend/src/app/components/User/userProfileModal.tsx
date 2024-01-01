import { UploadLogoEvent } from "@/app/DTOs/UserDTO"
import { useUserContext } from "@/app/context/UserContext"
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Switch,
} from "@nextui-org/react"
import React, { useRef, useState } from "react"
import { useTheme } from "next-themes"

export default function UserProfileModal(props: {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
}) {
	const { currentUser, sendWebSocketMessage } = useUserContext()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [selectedFile, setSelectedFile] = useState<File>()
	const [isSelected, setIsSelected] = useState(false)
	const { theme, setTheme } = useTheme()

	const uploadImage = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const changeTheme = (e: boolean) => {
		if (e) {
			setTheme("light")
		} else {
			setTheme("dark")
		}
		setIsSelected(e)
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0]

		if (
			!selectedFile ||
			!["image/png", "image/jpg", "image/jpeg"].includes(selectedFile.type)
		) {
			alert("Please select a valid image file (PNG, JPG, JPEG).")
			return
		}

		setSelectedFile(selectedFile)
	}

	const apply = () => {
		if (selectedFile) {
			const reader = new FileReader()
			reader.onload = (event) => {
				if (event.target?.result) {
					const base64Image = event.target.result.toString()
					const imgEvent = new UploadLogoEvent(base64Image, currentUser.id)
					sendWebSocketMessage(imgEvent)
				}
			}

			reader.onerror = (error) => {
				console.error(`Error reading file: ${error}`)
			}
			reader.readAsDataURL(selectedFile)
		}
	}
	return (
		<Modal
			isOpen={props.isOpen}
			onOpenChange={props.onOpenChange}
			placement="center"
			className="bg-surface-200"
			size="3xl"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1"></ModalHeader>
						<ModalBody className="flex flex-col items-center">
							<div>
								<input
									type="file"
									id="imageInput"
									ref={fileInputRef}
									onChange={handleFileChange}
									className="hidden"
								/>
								<Button
									className="flex justify-center items-center border-surface-400 hover:bg-surface-300"
									variant="ghost"
									radius="none"
									onPress={uploadImage}
								>
									Change logo
									<span className="material-symbols-outlined">image</span>
								</Button>
							</div>
							<Switch
								defaultSelected
								size="lg"
								color="success"
								isSelected={isSelected}
								onValueChange={changeTheme}
								startContent={
									<div className="flex justify-center items-center w-2 h-2">
										<span className="material-symbols-outlined flex justify-center items-center w-2 h-2">
											light_mode
										</span>
									</div>
								}
								endContent={
									<div className="flex justify-center items-center">
										<span className="material-symbols-outlined flex justify-center items-center">
											dark_mode
										</span>
									</div>
								}
							></Switch>
						</ModalBody>
						<ModalFooter>
							<Button
								color="success"
								onClick={() => {
									onClose()
									apply()
								}}
								endContent={
									<span className="material-symbols-outlined">check</span>
								}
							>
								Apply
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
