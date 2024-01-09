import { Invite, SenderDTO, UploadLogoEvent } from "@/app/DTOs/UserDTO"
import { useUserContext } from "@/app/context/UserContext"
import {
	Accordion,
	AccordionItem,
	Avatar,
	Button,
	Divider,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	User,
} from "@nextui-org/react"
import ThemeSwitch from "./ThemeSwitch"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { relative } from "path"
import InviteComponent from "../shared/InviteComponent"

export default function UserProfileModal(props: {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
}) {
	const { currentUser, sendWebSocketMessage } = useUserContext()
	const fileInputRef = useRef<HTMLInputElement>(null)
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

	return (
		<Modal
			isOpen={props.isOpen}
			onOpenChange={props.onOpenChange}
			placement="center"
			className="bg-surface-200"
			size="md"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col items-center">
							<div className="flex flex-col justify-center items-center gap-4">
								<Avatar
									src={currentUser.logo}
									isBordered
									className="w-20 h-20"
									imgProps={{
										style: {
											objectFit: "cover",
											objectPosition: "center",
											height: "100%",
											width: "100%",
										},
									}}
								/>
								<div className="flex flex-row justify-center items-center gap-2">
									<Button
										className="flex justify-center items-center border-surface-400 hover:bg-surface-300 h-9"
										variant="ghost"
										radius="sm"
										onPress={uploadImage}
									>
										Update logo
										<span className="material-symbols-outlined">image</span>
									</Button>
									<ThemeSwitch changeTheme={changeTheme}></ThemeSwitch>
								</div>
								<input
									type="file"
									id="imageInput"
									ref={fileInputRef}
									onChange={handleFileChange}
									className="hidden"
								/>
							</div>
						</ModalHeader>
						<ModalBody className="flex flex-col items-center px-16 gap-5">
							<div className="flex flex-row justify-between items-center w-full">
								<span className="text-lg">Username</span>
								<span className="text-primary text-lg">{currentUser.username}</span>
							</div>
							<Divider></Divider>
							<div className="flex flex-row justify-between items-center w-full">
								<span className="text-lg">Email</span>
								<span className="text-primary text-lg">{currentUser.email}</span>
							</div>
							<Accordion className="w-full px-0">
								<AccordionItem title="Invites" aria-label="Invites">
									{currentUser.invites.map((invite) => (
										<InviteComponent invite={invite} key={invite.id} />
									))}
								</AccordionItem>
							</Accordion>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
