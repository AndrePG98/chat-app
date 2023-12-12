import { ChannelDTO } from "@/app/DTOs/ChannelDTO"
import { SelectedChannelContext } from "@/app/components/Guild"
import { Button } from "@nextui-org/react"
import { useContext } from "react"

export default function TextChannelBtn(props: { channel: ChannelDTO }) {
	const { selectChannel } = useContext(SelectedChannelContext)

	return (
		<Button
			onPress={() => selectChannel(props.channel.id)}
			className="h-8 w-full text-lg flex justify-start"
			startContent={<span className="material-symbols-outlined">edit</span>}
			variant="light"
			radius="none"
		>
			{props.channel.name}
		</Button>
	)
}
