"use client"

import Server from './components/Server'
import LoggedInUser from './components/LoginUser'
import ServersPanel from './layouts/ServersPanel'
import { Skeleton } from '@nextui-org/react'
import useConnectToServer from './services/connectService';
import LoadingComponent from './components/LoadingComponent';


export default function Home() {

	const connected = useConnectToServer()

	return (
		<main className="flex h-screen flex-row">
			{/* Fetch servers and display server based on servers panel selection*/}
			<LoggedInUser></LoggedInUser>
			<ServersPanel></ServersPanel>
			<Server></Server>
		</main>
	)
}
