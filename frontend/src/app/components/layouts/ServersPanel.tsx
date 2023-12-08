import { useAuth } from "@/app/context/authContext"
import { Divider, User } from "@nextui-org/react"

export default function ServersPanel() {
	const { currentUser } = useAuth()
	return (
		<aside
			className="servers-panel h-screen w-64 py-5 px-4 border-r border-gray-700 flex flex-col"
			style={{ border: "2px solid green" }}
		>
			<nav className="flex justify-center items-center">
				<div className="space-y-3">
					<User
						name={currentUser.name}
						description={currentUser.id}
						avatarProps={{
							src: currentUser.logo,
						}}
					/>
					<Divider className="w-52"></Divider>
				</div>
			</nav>
		</aside>
	)
}
