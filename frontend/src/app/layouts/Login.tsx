"use client"

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { useState } from 'react'
import { useWebSocketContext } from '../contexts/WebsocketContext'

export default function Login() {
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const { login } = useWebSocketContext()
    const [userIdInput, setUserIdInput] = useState("")
    const [userNameInput, setUserNameInput] = useState("")
    const [userGuildsInput, setUserGuildsInput] = useState("")

    return (
        <div>
            <Modal isOpen={isOpen} placement='center'>
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Create User
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                label="userId"
                                value={userIdInput}
                                onValueChange={setUserIdInput}>
                            </Input>
                            <Input
                                label="userName"
                                value={userNameInput}
                                onValueChange={setUserNameInput}>
                            </Input>
                            <Input
                                label="guilds"
                                value={userGuildsInput}
                                onValueChange={setUserGuildsInput}>
                            </Input>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                onPress={() => {
                                    login(userIdInput, userNameInput, userGuildsInput.split(" "));
                                    setIsOpen(false)
                                }}
                            >
                                Create User
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </div>
    )
}
