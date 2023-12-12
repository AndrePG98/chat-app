import { ChannelDTO } from "@/app/DTOs/ChannelDTO"
import { Button } from "@nextui-org/react"

export default function TextChannelBtn(props: {
	channel: ChannelDTO
	selectChannel: (channel: ChannelDTO) => void
}) {
	return (
		<Button
			onPress={() => props.selectChannel(props.channel)}
			className="h-8 w-full text-lg flex justify-start"
			startContent={<span className="material-symbols-outlined">edit</span>}
			variant="light"
			radius="none"
		>
			{props.channel.name}
		</Button>
	)
}
