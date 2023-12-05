"use client"

import Server from './components/Server'
import ServersPanel from './layouts/ServersPanel'
import useConnectToServer from './services/connectService';
import LoadingComponent from './components/LoadingComponent';

export default function Home() {

	const connected = useConnectToServer()

	return (
		<main className="flex h-screen flex-row">

			{!connected ? <LoadingComponent /> : (<>
				<ServersPanel></ServersPanel>
				<Server></Server>
			</>)}
		</main>
	)
}
