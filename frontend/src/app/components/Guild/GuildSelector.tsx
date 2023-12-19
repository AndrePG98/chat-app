import { GuildDTO } from "@/app/DTOs/GuildDTO"
import GuildBtn from "./GuildBtn"
import { Button, Divider } from "@nextui-org/react"
import CreateGuildModal from "./CreateGuildModal"
import { useState } from "react"
import UserInfo from "../User/UserInfo"
import { UserDTO } from "@/app/DTOs/UserDTO"

export default function GuildSelector(props: {
	currentUser: UserDTO
	selectGuild: (guild: GuildDTO) => void
	createNewGuild: (guildName: string) => void
	leaveGuild: (guildId: string) => void
}) {
	const [modalOpen, setModalOpen] = useState(false)

	const openModal = () => {
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
	}

	return (
		<aside
			className="servers-panel h-screen w-64 py-5 px-4 border-r border-gray-700 flex flex-col"
			style={{ border: "2px solid green" }}
		>
			<UserInfo currentUser={props.currentUser}></UserInfo>
			<Divider className="my-2"></Divider>
			<div>
				<div className="my-3">
					{props.currentUser.getGuilds().map((guild, index) => (
						<GuildBtn
							guild={guild}
							selectGuild={props.selectGuild}
							leaveGuild={props.leaveGuild}
							key={index}
						></GuildBtn>
					))}
					<Button
						isIconOnly
						className="flex justify-center items-center w-full my-2"
						onClick={openModal}
					>
						<span className="material-symbols-outlined">add</span>
					</Button>
					<CreateGuildModal
						isOpen={modalOpen}
						onOpenChange={closeModal}
						createNewGuild={props.createNewGuild}
					/>
				</div>
			</div>
		</aside>
	)
}
