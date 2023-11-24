import ServersPanel from './layouts/ServersPanel'
import ChannelsPanel from './layouts/ChannelsPanel'

export default function Home() {
	return (
		<main className="flex h-screen flex-row justify-between">
			<ServersPanel></ServersPanel>
			<ChannelsPanel></ChannelsPanel>
		</main>
	)
}
