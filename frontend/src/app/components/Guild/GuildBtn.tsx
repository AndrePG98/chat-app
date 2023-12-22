import { GuildDTO } from "@/app/DTOs/GuildDTO"
import { Button, Badge } from "@nextui-org/react"
import React, { useEffect, useRef, useState } from "react"
import "./guildBtn.css"

export default function GuildBtn(props: {
	guild: GuildDTO
	selectGuild: (guild: GuildDTO) => void
	selectedGuildId: string | undefined
}) {
	const [notifications, setNotifications] = useState(false)
	const [isSelected, setIsSelected] = useState(false)

	useEffect(() => {
		setIsSelected(props.selectedGuildId == props.guild.guildId)
	}, [props.selectedGuildId])

	return (
		<button
			className={`${
				isSelected ? "guildBtn" : ""
			} w-full flex flex-row items-center justify-between h-[5%] pl-10 pr-5`}
			onClick={() => props.selectGuild(props.guild)}
		>
			<div className="text-xl flex justify-center items-center h-full">
				{props.guild.guildName}
			</div>
			{notifications && (
				<Badge
					color="warning"
					size="sm"
					className="flex justify-center items-center w-5 h-5 border-0"
					content={
						<div className="flex justify-center items-center">
							<span className="material-symbols-outlined">priority_high</span>
						</div>
					}
					variant="solid"
					placement="top-right"
					shape="circle"
				>
					<></>
				</Badge>
			)}
		</button>
	)
}
