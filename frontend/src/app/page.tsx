"use client"

import Server from "./components/Server"
import { useAuth } from "./context/authContext"
import RegisterLoginOption from "./components/layouts/RegisterLoginOption"
import ServersPanel from "./components/layouts/ServersPanel"

const Home = () => {
	const { authenticated } = useAuth()
	return (
		<main>
			{!authenticated && <RegisterLoginOption></RegisterLoginOption>}
			{authenticated && (
				<div className="flex h-screen flex-row">
					<ServersPanel></ServersPanel>
					<Server></Server>
				</div>
			)}
		</main>
	)
}

export default Home
