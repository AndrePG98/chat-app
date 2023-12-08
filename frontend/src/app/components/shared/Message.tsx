import { useAuth } from "@/app/context/authContext"
import { Avatar } from "@nextui-org/react"
import React from "react"

export default function Message(props: { message: string }) {
	const { currentUser } = useAuth()

	return (
		<div className="message flex gap-4 max-w-full">
			<div>
				<Avatar src={currentUser.logo} />
			</div>
			<div className="flex-1 overflow-auto">
				<div className="max-w-[90%]">
					<p className="text-sm break-words">{props.message}</p>
				</div>
			</div>
		</div>
	)
}
