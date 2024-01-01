import { GuildDTO } from "@/app/DTOs/GuildDTO"
import GuildBtn from "./GuildBtn"
import { Button, Divider } from "@nextui-org/react"
import CreateGuildModal from "./CreateGuildModal"
import { useEffect, useRef, useState } from "react"
import UserInfo from "../User/UserInfo"
import { UserDTO } from "@/app/DTOs/UserDTO"
import "./guildSelector.css"
import { JSXElement } from "solid-js"

export default function GuildSelector(props: {
	currentUser: UserDTO
	selectGuild: (guild: GuildDTO) => void
	selectedGuildId: string | undefined
}) {
	const [isOverflowing, setIsOverflowing] = useState(false)
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		const scrollContainer = scrollContainerRef.current
		if (scrollContainer) {
			setIsOverflowing(scrollContainer.scrollHeight > scrollContainer.clientHeight)
		}
	}, [props.currentUser.guilds.length])

	return (
		<aside className="basis-[15%] pt-3 pb-1 borde-r flex flex-col bg-surface-200 drop-shadow-custom h-full ">
			<UserInfo currentUser={props.currentUser}></UserInfo>
			<div
				ref={scrollContainerRef}
				className={`guild-selector flex flex-col gap-3 overflow-y-scroll pt-2 flex-grow ${
					isOverflowing ? "is-scrollable" : ""
				}`}
			>
				{props.currentUser.getGuilds().map((guild, index) => (
					<GuildBtn
						guild={guild}
						selectGuild={props.selectGuild}
						selectedGuildId={props.selectedGuildId}
						key={index}
					></GuildBtn>
				))}
			</div>
		</aside>
	)
}
