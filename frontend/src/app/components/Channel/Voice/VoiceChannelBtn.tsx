import React from "react"
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Listbox,
	ListboxItem,
	User,
} from "@nextui-org/react"
import "./voiceChannelBtn.css"
import { ChannelDTO } from "@/app/DTOs/ChannelDTO"

export default function VoiceChannelBtn(props: {
	channel: ChannelDTO
	addChannelUser: (channel: ChannelDTO) => void
	deleteChannel: (channelId: string) => void
}) {
	return (
		<div className="relative flex flex-col gap-2">
			<div
				className={`${
					props.channel.members.length > 0 ? "voiceChanBtn" : ""
				} flex flex-row group h-12`}
			>
				<button
					onClick={() => props.addChannelUser(props.channel)}
					className="w-full text-lg flex justify-between group-hover:bg-surface-400 pl-2"
				>
					<div className="flex flex-row justify-center items-center gap-2">
						<span className="material-symbols-outlined">volume_up</span>
						{props.channel.channelName}
					</div>
				</button>
				<Dropdown size="sm" className="bg-surface-200 border-2 border-surface-100">
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
			{props.channel.channelType === "voice" && props.channel.members.length !== 0 && (
				<Listbox
					variant="light"
					emptyContent=""
					itemClasses={{
						base: "w-1/2 left-[15%]",
					}}
				>
					{props.channel.members.map((member, index) => (
						<ListboxItem key={index} className="listboxitem">
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
