import {
	Button,
	Input,
	Listbox,
	ListboxItem,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ScrollShadow,
	Avatar
} from '@nextui-org/react'

import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll'
import { useCallback, useEffect, useState } from 'react'
import { useUsersList } from '../shared/useUsersList'
import { GuildDTO } from '../../DTOs/GuildDTO'
import { InviteEvent } from '../../DTOs/UserDTO'
import { useUserContext } from '../../context/UserContext'

export default function InviteModal(props: {
	guild: GuildDTO
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
}) {
	const [input, setInput] = useState('')
	const { users, setSearchTerm, onLoadMore, hasMore } = useUsersList()
	const { currentUser, sendWebSocketMessage } = useUserContext()

	const [, scrollerRef] = useInfiniteScroll({
		hasMore,
		isEnabled: true,
		shouldUseLoader: false,
		onLoadMore
	})

	useEffect(() => {
		const handler = setTimeout(() => {
			setSearchTerm(input)
		}, 500)

		return () => {
			clearTimeout(handler)
		}
	}, [input])

	const inputChange = useCallback((input: string) => {
		setInput(input)
	}, [])

	const invite = (receiverId: string) => {
		const sender = currentUser.convert()
		const event = new InviteEvent(
			sender,
			receiverId,
			props.guild.guildId,
			props.guild.guildName
		)
		sendWebSocketMessage(event)
	}

	return (
		<Modal
			isOpen={props.isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					setInput('')
					setSearchTerm('')
				}
				props.onOpenChange(isOpen)
			}}
			placement="center"
			size="2xl"
			className="bg-surface-200 shadow-lg rounded-lg overflow-visible"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="px-10 py-6 border-b ">
							<Input
								type="name"
								classNames={{
									input: ['bg-transparent'],
									innerWrapper: 'bg-transparent',
									inputWrapper: [
										'bg-surface-300 focus:bg-surface-300 active:bg-surface-300',
										'dark:bg-surface-300 focus:bg-surface-300 active:bg-surface-300',
										'hover:bg-surface-400 ',
										'dark:hover:bg-surface-400',
										'focus:bg-surface-400 active:bg-surface-400',
										'dark:focus:bg-surface-400 active:bg-surface-300',
										'!cursor-text'
									]
								}}
								label="Search"
								placeholder="Username"
								value={input}
								onValueChange={inputChange}
							/>
						</ModalHeader>
						<ModalBody className="py-6">
							<ScrollShadow
								hideScrollBar
								className="h-80 overflow-y-auto"
								ref={scrollerRef}
							>
								<Listbox
									emptyContent={'No users'}
									variant="bordered"
									color="primary"
								>
									{users
										.filter((user) => {
											return !props.guild.members.some(
												(member) => user.userId === member.userId
											)
										})
										.map((user) => (
											<ListboxItem key={user.userId} disableAnimation>
												<div className="flex flex-row gap-2 items-center justify-start">
													<Avatar
														src={user.logo}
														imgProps={{
															style: {
																objectFit: 'cover',
																objectPosition: 'center',
																height: '100%',
																width: '100%'
															}
														}}
													/>
													<span className="flex-1">{user.username}</span>
													<div className="flex flex-row justify-center items-center pr-5">
														<Button
															isIconOnly
															variant="light"
															size="sm"
															onPress={() => {
																invite(user.userId)
															}}
														>
															<span className="material-symbols-outlined">
																forward_to_inbox
															</span>
														</Button>
													</div>
												</div>
											</ListboxItem>
										))}
								</Listbox>
							</ScrollShadow>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
