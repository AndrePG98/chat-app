import { useAuth } from "@/app/context/authContext"
import { User } from "@nextui-org/react"

export default function Message(props: { message: string }) {
	const { currentUser } = useAuth()

	return (
		<div className="m-2">
			<User
				name={currentUser.name}
				description={props.message}
				avatarProps={{
					src: currentUser.logo,
				}}
			/>
		</div>
	)
}
