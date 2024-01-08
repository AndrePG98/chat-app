import { CreateGuildEvent } from "@/app/DTOs/GuildDTO"
import { UserDTO } from "@/app/DTOs/UserDTO"
import { useUserContext } from "@/app/context/UserContext"
import { Button, User, Badge } from "@nextui-org/react"
import React, { useEffect, useState } from "react"
import CreateGuildModal from "../Guild/CreateGuildModal"
import "./userStyle.css"
import UserProfileModal from "./userProfileModal"

export default function UserInfo(props: { currentUser: UserDTO }) {
	const { logout } = useUserContext()
	const { currentUser, sendWebSocketMessage } = useUserContext()
	const [createGuildModalOpen, setCreateGuildModalOpen] = useState(false)
	const [userProfileOpen, setUserProfileOpen] = useState(false)
	const [imageSrc, setImageSrc] = useState("")
	const [isInvisible, setIsInvisible] = useState(false)

	useEffect(() => {
		setImageSrc(currentUser.logo)
	}, [currentUser.logo])

	useEffect(() => {
		if (currentUser.invites.length > 0) {
			setIsInvisible(false)
		} else {
			setIsInvisible(true)
		}
	}, [currentUser.invites.length])

	const openUserProfileModal = () => {
		setUserProfileOpen(true)
	}

	const closeUserProfileModal = () => {
		setUserProfileOpen(false)
	}

	const openCreateGuildModal = () => {
		setCreateGuildModalOpen(true)
	}

	const closeCreateGuildModla = () => {
		setCreateGuildModalOpen(false)
	}

	const createNewGuild = (guildName: string) => {
		const guild = new CreateGuildEvent(currentUser.id, guildName)
		sendWebSocketMessage(guild)
	}

	return (
		<div className="flex flex-col gap-3 px-3 border-b-1 border-faded">
			<div className="flex flex-row justify-between items-center">
				<User
					key={imageSrc}
					name={props.currentUser.username}
					avatarProps={{
						src: imageSrc,
						imgProps: {
							style: {
								objectFit: "cover",
								objectPosition: "center",
								height: "100%",
								width: "100%",
							},
						},
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
			<div className="flex flex-row py-2 px-1">
				<Button
					variant="light"
					radius="none"
					isIconOnly
					className="flex justify-center items-center w-full"
					onPress={openCreateGuildModal}
				>
					<span className="material-symbols-outlined">add</span>
				</Button>
				<Badge
					content={currentUser.invites.length}
					color="warning"
					isInvisible={isInvisible}
				>
					<Button
						className="flex justify-center items-center w-full"
						variant="light"
						radius="none"
						isIconOnly
						onPress={openUserProfileModal}
						endContent={<div />}
					>
						<span className="material-symbols-outlined">manage_accounts</span>
					</Button>
				</Badge>
				<CreateGuildModal
					isOpen={createGuildModalOpen}
					onOpenChange={closeCreateGuildModla}
					createNewGuild={createNewGuild}
				/>
				<UserProfileModal isOpen={userProfileOpen} onOpenChange={closeUserProfileModal} />
			</div>
		</div>
	)
}
