import { ResultType } from "../../DTOs/Types"
import { FetchUsersEvent, FetchUsersResult, SenderDTO, UserDTO } from "../../DTOs/UserDTO"
import { useUserContext } from "../../context/UserContext"
import { FetchEventResult } from "next/dist/server/web/types"
import { useEffect, useState } from "react"

export function useUsersList() {
	const { receivedMessage, sendWebSocketMessage } = useUserContext()
	const [users, setUsers] = useState<SenderDTO[]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [hasMore, setHasMore] = useState(true)
	const [offset, setOffset] = useState(0)
	const limit = 20

	useEffect(() => {
		if (receivedMessage.type === ResultType.R_FetchUsers) {
			const msg = receivedMessage as FetchUsersResult
			if (receivedMessage.body.users !== null) {
				setUsers((prevUsers) => [...prevUsers, ...msg.body.users])
				const newOffset = offset + limit
				setOffset(newOffset)
			} else {
				setUsers([])
				setOffset(0)
			}
			setHasMore(msg.body.hasMore)
		}
	}, [receivedMessage])

	useEffect(() => {
		setOffset(0)
		setUsers([])
		loadUsers(0)
	}, [searchTerm])

	const loadUsers = async (currentOffset: number) => {
		if (searchTerm !== "") {
			const event = new FetchUsersEvent(searchTerm, currentOffset, limit)
			sendWebSocketMessage(event)
		}
	}

	const onLoadMore = () => {
		loadUsers(offset)
	}

	return {
		users,
		hasMore,
		onLoadMore,
		setSearchTerm,
	}
}
