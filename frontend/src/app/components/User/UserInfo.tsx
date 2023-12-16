import { UserDTO } from "@/app/DTOs/UserDTO"
import { useUserContext } from "@/app/context/UserContext"
import { Button, User } from "@nextui-org/react"
import React from "react"

export default function UserInfo(props: { currentUser: UserDTO }) {
	const { logout } = useUserContext()
	return (
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
	)
}
