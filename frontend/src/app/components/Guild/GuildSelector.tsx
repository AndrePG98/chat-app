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
}) {
	return (
		<aside className="basis-[15%] py-5 border-r border-gray-800 flex flex-col">
			<UserInfo currentUser={props.currentUser}></UserInfo>
			<Divider className="mb-2"></Divider>
			<div className="my-3 flex flex-col gap-3 h-full">
				{props.currentUser.getGuilds().map((guild, index) => (
					<GuildBtn guild={guild} selectGuild={props.selectGuild} key={index}></GuildBtn>
				))}
			</div>
		</aside>
	)
}
