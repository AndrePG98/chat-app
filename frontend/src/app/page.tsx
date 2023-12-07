"use client"

import Server from './components/Server'
import LoggedInUser from './components/LoginUser'
import Login from './layouts/Login'
import ServersPanel from './layouts/ServersPanel'
import { Skeleton } from '@nextui-org/react'
import useConnectToServer from './services/connectService';
import LoadingComponent from './components/LoadingComponent';


export default function Home() {

	const connected = useConnectToServer()

	return (
		<main >
			<Login></Login>
			<div className="flex h-screen flex-row">
				<ServersPanel></ServersPanel>
				<Server></Server>
			</div>
		</main>
	)
}
