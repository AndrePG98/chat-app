import { Button, Input } from "@nextui-org/react"
import React, { useEffect, useRef, memo } from "react"
import Message from "./Message"
import { MessageDTO } from "@/app/DTOs/MessageDTO"
import { Console } from "console"

interface ChatPanelProps {
	messages: MessageDTO[]
	channelId: string
	createNewMessage: (message: string) => void
}

export default function ChatPanel(props: ChatPanelProps) {
	const [input, setInput] = React.useState("")
	const chatContainerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
		}
	}, [props.messages.length])

	const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" && input !== "") {
			event.preventDefault()
			props.createNewMessage(input)
			setInput("")
		}
	}

	return (
		<div
			className="chat-panel flex flex-col h-full px-3 pb-5"
			style={{ border: "2px solid blue" }}
		>
			<div
				ref={chatContainerRef}
				className="message-container flex flex-col gap-10 overflow-y-auto flex-1 w-full pt-5 px-3 pb-3"
			>
				{props.messages.map((message, index) => (
					<Message message={message} key={index}></Message>
				))}
			</div>
			{props.channelId !== null && (
				<div>
					<Input
						className=""
						radius="md"
						variant="bordered"
						placeholder="Say something..."
						value={input}
						onValueChange={setInput}
						onKeyDown={handleKeyPress}
						endContent={
							<Button
								isIconOnly
								className="bg-transparent outline-none"
								color="primary"
								disableRipple
								variant="flat"
								onPress={() => {
									if (input !== "") {
										props.createNewMessage(input)
										setInput("")
									}
								}}
							>
								<span className="material-symbols-outlined">send</span>
							</Button>
						}
					></Input>
				</div>
			)}
		</div>
	)
}
