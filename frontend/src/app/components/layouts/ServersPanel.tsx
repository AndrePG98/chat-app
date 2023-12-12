import { useAuth } from "@/app/context/authContext"
import { Button, Divider, User } from "@nextui-org/react"
import { useState } from "react"
import { useApp } from "../App"
import Guild from "../Guild"
import CreateServerModal from "../shared/CreateServerModal"
import ServerBtn from "../shared/ServerBtn"

export const ServersPanel = () => {
	const { currentUser } = useAuth()
	const [modalOpen, setModalOpen] = useState(false)
	const { guild, createGuild, selectGuild } = useApp()

	const openModal = () => {
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
	}

	const createNewGuild = (name: string) => {
		createGuild(name)
	}

	return (
		<>
			<aside className="w-64" style={{ border: "2px solid green" }}>
				<div>
					<div className="m-4">
						<User
							name={currentUser.name}
							description={currentUser.id}
							avatarProps={{
								src: currentUser.logo,
							}}
						/>
					</div>
					<div className="flex justify-center">
						<Divider className="w-52"></Divider>
					</div>
					<div className="channel-buttons flex-1">
						{currentUser.getGuilds().map((guild) => (
							<div key={guild.id}>
								<ServerBtn guild={guild} selectGuild={selectGuild} />
							</div>
						))}
					</div>
					<div className="w-64 fixed bottom-0">
						<CreateServerModal
							isOpen={modalOpen}
							onOpenChange={closeModal}
							createNewServer={createNewGuild}
						/>
						<Button
							variant="light"
							radius="none"
							size="sm"
							fullWidth
							isIconOnly
							className="flex justify-center items-center w-full"
							onClick={openModal}
						>
							<span className="material-symbols-outlined">add</span>
						</Button>
					</div>
				</div>
			</aside>
			{guild && <Guild guild={guild}></Guild>}
		</>
	)
}
