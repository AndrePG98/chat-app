import React, { useContext, useState } from "react"
import { Button, Listbox, ListboxItem, User } from "@nextui-org/react"
import { ChannelDTO, JoinChannelEvent } from "@/app/DTOs/ChannelDTO"
import { useUserContext } from "@/app/context/UserContext"
import { SenderDTO } from "@/app/DTOs/UserDTO"

export default function VoiceChannelBtn(props: {
	channel: ChannelDTO
	selectChannel: (channel: ChannelDTO) => void
	addChannelUser: (channel: ChannelDTO) => void
}) {
	return (
		<div>
			<Button
				onPress={() => props.selectChannel(props.channel)}
				className="h-8 w-full text-lg flex justify-start"
				startContent={<span className="material-symbols-outlined">volume_up</span>}
				onClick={() => props.addChannelUser(props.channel)}
				variant="light"
				radius="none"
			>
				{props.channel.channelName}
			</Button>
			{props.channel.channelType === "voice" && props.channel.members.length !== 0 && (
				<Listbox
					variant="light"
					emptyContent=""
					itemClasses={{
						base: "w-1/2 left-[15%]",
					}}
				>
					{props.channel.members.map((member, index) => (
						<ListboxItem key={index}>
							<User
								key={index}
								className="flex justify-start items-center py-.5 px-.5"
								name={member.username}
								avatarProps={{
									src: member.logo,
									size: "sm",
									className: "text-tiny w-5 h-5",
								}}
							/>
						</ListboxItem>
					))}
				</Listbox>
			)}
		</div>
	)
}
