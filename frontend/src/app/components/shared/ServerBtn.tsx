import { Button } from "@nextui-org/react"

export default function ServerBtn(props: {
	serverId: string
	serverName: string
	selectServer: (serverId: string) => void
}) {
	const showServerId = () => {
		props.selectServer(props.serverId)
	}

	return (
		<Button
			onPress={() => showServerId()}
			className="h-8 w-full text-lg flex justify-start"
			startContent={<span className="material-symbols-outlined">edit</span>}
			variant="light"
			radius="none"
		>
			{props.serverName}
		</Button>
	)
}
