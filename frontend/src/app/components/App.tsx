import { useState } from "react"
import { ServerDTO } from "../DTOs/ServerDTO"

export const useApp = () => {
	const [server, setServer] = useState<ServerDTO>()
	const [servers, setServers] = useState<ServerDTO[]>([])

	//Temporary counter to increment generate and keeptrack of Server Ids
	//Will be fetched from the DB in the future
	const [tempCounter, setTempCounter] = useState(1)

	const createServer = (name: string) => {
		//TODO fetch id from database in the future
		const server = new ServerDTO(tempCounter.toString(), name)

		setServers((prevServers: ServerDTO[]) => [...prevServers, server])
		setServer(server)
		setTempCounter(tempCounter + 1)
	}

	const selectServer = (serverId: string) => {
		for (let server of servers) {
			if (serverId == server.id) {
				setServer(server)
			}
		}
	}

	return { server, servers, createServer, selectServer }
}
