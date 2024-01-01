import { UploadLogoEvent } from "@/app/DTOs/UserDTO"
import { useUserContext } from "@/app/context/UserContext"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import React, { useRef } from "react"

export default function UserProfileModal(props: {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
}) {
	const { currentUser, sendWebSocketMessage } = useUserContext()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const uploadImage = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
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
			size="3xl"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1"></ModalHeader>
						<ModalBody>
							<input
								type="file"
								id="imageInput"
								ref={fileInputRef}
								onChange={handleFileChange}
								className="hidden"
							/>
							<Button
								className="flex justify-center items-center"
								variant="light"
								radius="none"
								isIconOnly
								onPress={uploadImage}
							>
								<span className="material-symbols-outlined">image</span>
							</Button>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Close
							</Button>
							<Button
								className="w-full"
								color="success"
								onClick={() => {
									onClose()
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
