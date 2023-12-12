import { MessageDTO } from "@/app/DTOs/MessageDTO"
import { Avatar } from "@nextui-org/react"
import React from "react"

export default function Message(props: { message: MessageDTO }) {
	return (
		<div className="message flex gap-4 max-w-full">
			<div>
				<Avatar src={"https://source.unsplash.com/random/150x150/?avatar"} />
			</div>
			<div className="flex-1 overflow-auto">
				<div className="max-w-[90%]">
					<p className="text-sm break-words">{props.message.body}</p>
				</div>
			</div>
		</div>
	)
}
