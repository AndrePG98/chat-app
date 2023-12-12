import { GuildDTO } from "@/app/DTOs/GuildDTO"
import GuildBtn from "./GuildBtn"

export default function GuildSelector(props: {
	guilds: GuildDTO[]
	selectGuild: (guild: GuildDTO) => void
}) {
	return (
		<aside
			className="servers-panel h-screen w-64 py-5 px-4 border-r border-gray-700 flex flex-col"
			style={{ border: "2px solid green" }}
		>
			{props.guilds.map((guild, index) => (
				<GuildBtn guild={guild} selectGuild={props.selectGuild} key={index}></GuildBtn>
			))}
			{/* <nav className="flex justify-center items-center">
				<div className="space-y-3">
					<User
						name={currentUser.username}
						description={currentUser.id}
						avatarProps={{
							src: currentUser.logo,
						}}
					/>
					<Divider className="w-52"></Divider>
				</div>
			</nav> */}
		</aside>
	)
}
