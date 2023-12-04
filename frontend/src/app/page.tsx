"use client"

import Server from './components/Server'
import ServersPanel from './layouts/ServersPanel'
import { Skeleton } from "@nextui-org/react";
import useConnectToServer from './services/connectService';

export default function Home() {

	const connected = useConnectToServer()

	return (
		<main className="flex h-screen flex-row">
			{/* Fetch servers and display server based on servers panel selection*/}
			<Skeleton isLoaded={connected}>
				<ServersPanel></ServersPanel>
			</Skeleton>
			<Skeleton isLoaded={connected}>
				<Server></Server>
			</Skeleton>

		</main>
	)
}
