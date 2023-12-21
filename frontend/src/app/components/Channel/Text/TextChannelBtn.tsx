import { ChannelDTO } from "@/app/DTOs/ChannelDTO"
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react"

export default function TextChannelBtn(props: {
	channel: ChannelDTO
	selectChannel: (channel: ChannelDTO) => void
	deleteChannel: (channelId: string) => void
}) {
	return (
		<Button
			onPress={() => props.selectChannel(props.channel)}
			className="w-full text-lg flex justify-between"
			variant="light"
			radius="none"
			endContent={
				<Dropdown showArrow size="sm">
					<DropdownTrigger>
						<Button isIconOnly disableRipple className="bg-transparent">
							<span className="material-symbols-outlined">list</span>
						</Button>
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
			}
		>
			<div className="flex flex-row justify-center items-center gap-2">
				<span className="material-symbols-outlined">edit</span>
				{props.channel.channelName}
			</div>
		</Button>
	)
}
