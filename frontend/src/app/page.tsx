import Server from './components/Server'
import ServersPanel from './layouts/ServersPanel'

export default function Home() {
	return (
		<main className="flex h-screen flex-row">
			<ServersPanel></ServersPanel>
			<Server></Server>
		</main>
	)
}
