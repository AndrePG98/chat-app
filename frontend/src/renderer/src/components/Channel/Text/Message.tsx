import { DeleteMessageEvent, MessageDTO } from '../../../DTOs/MessageDTO'
import { useUserContext } from '../../../context/UserContext'
import './messageStyle.css'
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	User
} from '@nextui-org/react'

export default function Message(props: { message: MessageDTO }) {
	const { sendWebSocketMessage } = useUserContext()
	return (
		<div className="message flex gap-3 group" aria-label="Message">
			<User
				className="msg-sender text-xs"
				name={props.message.sender.username}
				description={props.message.sendAt}
				avatarProps={{ src: props.message.sender.logo }}
			/>
			<div className="flex-1 overflow-auto flex justity-start items-start">
				<div className="max-w-[90%]">
					<p className="text-sm break-words text-pretty break-all">
						{props.message.content}
					</p>
				</div>
			</div>
			<div>
				<Dropdown className="bg-surface-200 border-2 border-surface-100">
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
							variant="bordered"
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
