import Server from './components/Server'
import ServersPanel from './layouts/ServersPanel'


export default function Home() {
	return (
		<main className="flex h-screen flex-row">
			{/* Fetch servers and display server based on servers panel selection*/}
			<ServersPanel></ServersPanel>
			<Server></Server>
		</main>
	)
}
