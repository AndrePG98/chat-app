import React, { useState } from "react"
import { User } from "@nextui-org/react"
import { GuildDTO } from "@/app/DTOs/GuildDTO"
import { UserDTO } from "@/app/DTOs/UserDTO"

export default function MembersPanel(props: { members: UserDTO[] }) {
	return (
		<div
			className="w-52  border-l border-gray-700 flex flex-col justify-start items-start py-5 px-4 gap-5 overflow-y-auto"
			style={{ border: "2px solid white" }}
		>
			{props.members.map((member, index) => (
				<User
					key={index}
					className="text-amber-100"
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
