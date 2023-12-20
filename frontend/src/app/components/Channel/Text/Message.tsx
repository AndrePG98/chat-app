import { DeleteMessageEvent, MessageDTO } from "@/app/DTOs/MessageDTO"
import { useUserContext } from "@/app/context/UserContext"
import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/react"
import React from "react"

export default function Message(props: { message: MessageDTO }) {
	const { sendWebSocketMessage } = useUserContext()
	return (
		<div className="message flex gap-4 group" aria-label="Message">
			<div className="flex justify-center items-start">
				<Avatar size="md" src={"https://source.unsplash.com/random/150x150/?avatar"} />
			</div>
			<div className="flex-1 overflow-auto flex justity-start items-start">
				<div className="max-w-[90%]">
					<p className="text-sm break-words text-pretty break-all">
						{props.message.content}
					</p>
				</div>
			</div>
			<div>
				<Dropdown className="py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black">
					<DropdownTrigger>
						<Button
							variant="light"
							radius="lg"
							isIconOnly
							size="sm"
							className="flex justify-center items-center opacity-0 group-hover:opacity-50"
							aria-label="Message Options"
						>
							<span className="material-symbols-outlined">menu</span>
						</Button>
					</DropdownTrigger>
					<DropdownMenu>
						<DropdownItem
							key="delete"
							className="text-danger"
							color="danger"
							startContent={<span className="material-symbols-outlined">delete</span>}
							onPress={() => {
								const event = new DeleteMessageEvent(
									props.message.sender.userId,
									props.message.guildId,
									props.message.channelId,
									props.message.messageId
								)
								sendWebSocketMessage(event)
							}}
						>
							Delete message
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
		</div>
	)
}
