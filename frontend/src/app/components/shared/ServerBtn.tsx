import { GuildDTO } from "@/app/DTOs/GuildDTO"
import { Button } from "@nextui-org/react"

export default function ServerBtn(props: {
	guild: GuildDTO
	selectGuild: (guildId: string) => void
}) {
	const showGuildId = () => {
		props.selectGuild(props.guild.id)
	}

	return (
		<Button
			onPress={() => showGuildId()}
			className="h-8 w-full text-lg flex justify-start"
			startContent={<span className="material-symbols-outlined">edit</span>}
			variant="light"
			radius="none"
		>
			{props.guild.name}
		</Button>
	)
}
