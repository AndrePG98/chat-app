import { GuildDTO } from "@/app/DTOs/GuildDTO"
import { Button } from "@nextui-org/react"
import React from "react"

export default function GuildBtn(props: {
	guild: GuildDTO
	selectGuild: (guild: GuildDTO) => void
}) {
	return (
		<Button
			color="primary"
			variant="ghost"
			className="w-full my-1"
			onPress={() => props.selectGuild(props.guild)}
		>
			{props.guild.name}
		</Button>
	)
}
