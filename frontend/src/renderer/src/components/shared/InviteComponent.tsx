import { JoinGuildEvent } from "../../DTOs/GuildDTO"
import { CancelInviteEvent, Invite } from "../../DTOs/UserDTO"
import { useUserContext } from "../../context/UserContext"
import { Avatar, Button } from "@nextui-org/react"

export default function InviteComponent(props: { invite: Invite }) {
	const { sendWebSocketMessage, currentUser } = useUserContext()

	const acceptInvite = () => {
		const event = new JoinGuildEvent(
			props.invite.guildId,
			currentUser.convert(),
			props.invite.id
		)
		sendWebSocketMessage(event)
	}

	const cancelInvite = () => {
		const event = new CancelInviteEvent(props.invite.id)
		sendWebSocketMessage(event)
	}

	return (
		<div className="flex flex-col pl-1 justify-start">
			<div className="flex flex-row gap-3 justify-start items-center">
				<Avatar
					src={props.invite.sender.logo}
					isBordered
					className="w-5 h-5"
					imgProps={{
						style: {
							objectFit: "cover",
							objectPosition: "center",
							height: "100%",
							width: "100%",
						},
					}}
				/>
				{props.invite.sender.username}
			</div>
			<div className="flex flex-row items-center justify-start gap-2">
				<div className="flex-1">{`invites you to join ${props.invite.guildName}`}</div>
				<div className="flex flex-row items-center justify-center gap-1">
					<Button
						className="w-5 h-5"
						isIconOnly
						radius="full"
						variant="light"
						disableRipple
						color="success"
						onClick={acceptInvite}
					>
						<span className="material-symbols-outlined">done</span>
					</Button>
					<Button
						className="w-5 h-5"
						isIconOnly
						radius="full"
						variant="light"
						disableRipple
						color="danger"
						onClick={cancelInvite}
					>
						<span className="material-symbols-outlined">close</span>
					</Button>
				</div>
			</div>
		</div>
	)
}
