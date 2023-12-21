import { GuildDTO } from "@/app/DTOs/GuildDTO"
import { Button, Badge } from "@nextui-org/react"
import React, { useRef, useState } from "react"

export default function GuildBtn(props: {
	guild: GuildDTO
	selectGuild: (guild: GuildDTO) => void
}) {
	const [notifications, setNotifications] = useState(false)
	return (
		<Button
			color="primary"
			radius="none"
			variant="light"
			className="w-full flex flex-row items-center justify-between border-r-3 border-r-blue-500 pl-10"
			endContent={
				notifications && (
					<Badge
						color="warning"
						size="sm"
						className="flex justify-center items-center w-7 h-7"
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
				)
			}
			onPress={() => props.selectGuild(props.guild)}
		>
			<div className="text-xl flex justify-center items-center h-full">
				{props.guild.guildName}
			</div>
		</Button>
	)
}
