import { GuildDTO } from "../../DTOs/GuildDTO"
import GuildBtn from "./GuildBtn"
import { ScrollShadow } from "@nextui-org/react"
import { useEffect, useRef, useState } from "react"
import UserInfo from "../User/UserInfo"
import { UserDTO } from "../../DTOs/UserDTO"

export default function GuildSelector(props: {
	currentUser: UserDTO
	selectGuild: (guild: GuildDTO) => void
	selectedGuildId: string | undefined
}) {
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
		}
	}, [props.currentUser.guilds.length])

	return (
		<aside className="basis-[15%] pt-3 pb-1 borde-r flex flex-col bg-surface-200 drop-shadow-custom h-full ">
			<UserInfo currentUser={props.currentUser}></UserInfo>
			<ScrollShadow
				hideScrollBar
				size={150}
				className="flex flex-col gap-1 pt-2 flex-grow"
				ref={scrollContainerRef}
			>
				{props.currentUser.getGuilds().map((guild, index) => (
					<GuildBtn
						guild={guild}
						selectGuild={props.selectGuild}
						selectedGuildId={props.selectedGuildId}
						key={index}
					></GuildBtn>
				))}
			</ScrollShadow>
		</aside>
	)
}
