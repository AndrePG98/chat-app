import { GuildDTO } from "../../DTOs/GuildDTO"
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
				isSelected ? "guildBtn selected" : "guildBtn"
			} w-full h-[56px] min-h-[56px] flex flex-row items-center justify-center`}
			onClick={() => props.selectGuild(props.guild)}
		>
			<div className="flex justify-center items-center">{props.guild.guildName}</div>
			{notifications && <div className="notificationIndicator"></div>}
		</button>
	)
}
