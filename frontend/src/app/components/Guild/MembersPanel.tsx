import React from "react"
import { User } from "@nextui-org/react"
import { SenderDTO } from "@/app/DTOs/UserDTO"

export default function MembersPanel(props: { members: SenderDTO[] }) {
	return (
		<div className="basis-52 grow-0 shrink-0 flex flex-col justify-start items-start py-5 px-4 gap-5 overflow-y-auto bg-surface-100">
			{props.members.map((member, index) => (
				<User
					key={index}
					name={member.username}
					avatarProps={{
						src: member.logo,
						size: "sm",
					}}
				/>
			))}
		</div>
	)
}
