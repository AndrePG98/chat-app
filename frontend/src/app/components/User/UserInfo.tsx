import { UserDTO } from "@/app/DTOs/UserDTO"
import { User } from "@nextui-org/react"
import React from "react"

export default function UserInfo(props: { currentUser: UserDTO }) {
	return (
		<User
			name={props.currentUser.getName()}
			avatarProps={{
				src: props.currentUser.getLogo(),
			}}
		/>
	)
}
