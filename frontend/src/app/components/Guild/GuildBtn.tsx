import { GuildDTO } from "@/app/DTOs/GuildDTO"
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalFooter,
	Button,
	useDisclosure,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@nextui-org/react"
import React, { useRef, useState } from "react"

export default function GuildBtn(props: {
	guild: GuildDTO
	selectGuild: (guild: GuildDTO) => void
	leaveGuild: (guildId: string) => void
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	return (
		<Button
			color="primary"
			variant="bordered"
			className="w-full my-1 flex flex-row items-center justify-start"
			onPress={() => props.selectGuild(props.guild)}
			endContent={
				<Dropdown className="py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black">
					<DropdownTrigger>
						<Button
							variant="light"
							radius="lg"
							isIconOnly
							size="sm"
							className="flex justify-center items-center"
						>
							<span className="material-symbols-outlined">menu</span>
						</Button>
					</DropdownTrigger>
					<DropdownMenu>
						{/* <DropdownItem
							key="new"
							startContent={
								<span className="material-symbols-outlined">settings</span>
							}
						>
							Guild settings
						</DropdownItem> */}
						<DropdownItem
							key="delete"
							className="text-danger"
							color="danger"
							startContent={<span className="material-symbols-outlined">delete</span>}
							onPress={() => {
								onOpen()
							}}
						>
							Delete guild
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			}
		>
			<div className="w-11/12 h-full flex flex-row justify-start items-center text-lg">
				{props.guild.guildName}
			</div>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Delete guild?</ModalHeader>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									className="w-full"
									color="success"
									onClick={() => {
										onClose()
										props.leaveGuild(props.guild.guildId)
									}}
									endContent={
										<span className="material-symbols-outlined">check</span>
									}
								>
									Confirm
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</Button>
	)
}
