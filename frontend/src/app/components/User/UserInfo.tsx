import { CreateGuildEvent } from "@/app/DTOs/GuildDTO"
import { UserDTO } from "@/app/DTOs/UserDTO"
import { useUserContext } from "@/app/context/UserContext"
import { Button, User, Tooltip } from "@nextui-org/react"
import React, { useState } from "react"
import CreateGuildModal from "../Guild/CreateGuildModal"

export default function UserInfo(props: { currentUser: UserDTO }) {
	const { logout } = useUserContext()
	const { currentUser, sendWebSocketMessage } = useUserContext()
	const [modalOpen, setModalOpen] = useState(false)

	const openModal = () => {
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
	}

	const createNewGuild = (guildName: string) => {
		const guild = new CreateGuildEvent(currentUser.id, guildName)
		sendWebSocketMessage(guild)
	}
	return (
		<div className="flex flex-col gap-3 px-3">
			<div className="flex flex-row justify-between items-center">
				<User
					name={props.currentUser.username}
					avatarProps={{
						src: props.currentUser.getLogo(),
					}}
				/>
				<Button
					isIconOnly
					radius="sm"
					size="sm"
					color="danger"
					variant="light"
					onPress={logout}
				>
					<span className="material-symbols-outlined">logout</span>
				</Button>
			</div>
			<div className="flex flex-row">
				<Tooltip content="New guild" showArrow offset={-5} closeDelay={0} delay={500}>
					<Button
						isIconOnly
						radius="none"
						variant="light"
						className="flex justify-center items-center w-full"
						onClick={openModal}
					>
						<span className="material-symbols-outlined">add</span>
					</Button>
				</Tooltip>
				<Tooltip content="User settings" showArrow offset={-5} closeDelay={0} delay={500}>
					<Button
						isIconOnly
						radius="none"
						variant="light"
						className="flex justify-center items-center w-full"
					>
						<span className="material-symbols-outlined">manage_accounts</span>
					</Button>
				</Tooltip>
				<CreateGuildModal
					isOpen={modalOpen}
					onOpenChange={closeModal}
					createNewGuild={createNewGuild}
				/>
			</div>
		</div>
	)
}
