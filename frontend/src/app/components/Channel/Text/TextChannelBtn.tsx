import { ChannelDTO } from "@/app/DTOs/ChannelDTO"
import {
	Button,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	button,
} from "@nextui-org/react"

export default function TextChannelBtn(props: {
	channel: ChannelDTO
	selectChannel: (channel: ChannelDTO) => void
	deleteChannel: (channelId: string) => void
}) {
	return (
		<div className="flex flex-row group h-12">
			<button
				onClick={() => props.selectChannel(props.channel)}
				className="w-full text-lg flex justify-between group-hover:bg-surface-400 pl-2"
			>
				<div className="flex flex-row justify-center items-center gap-2">
					<span className="material-symbols-outlined">edit</span>
					{props.channel.channelName}
				</div>
			</button>
			<Dropdown showArrow size="sm">
				<DropdownTrigger>
					<button className="bg-transparent group-hover:bg-surface-400 flex justify-center items-center p-2">
						<span className="material-symbols-outlined">list</span>
					</button>
				</DropdownTrigger>
				<DropdownMenu>
					<DropdownItem
						key="delete"
						className="text-danger"
						color="danger"
						variant="bordered"
						startContent={<span className="material-symbols-outlined">delete</span>}
						onPress={() => {
							props.deleteChannel(props.channel.channelId)
						}}
					>
						Delete channel
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	)
}
