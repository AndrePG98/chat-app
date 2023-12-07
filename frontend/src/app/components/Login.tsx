"use client"

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { useState } from 'react'
import Server from './Server'
import { useUserContext } from '../contexts/userContext'
import ServersPanel from '../layouts/ServersPanel'

export default function Login() {
    const { login } = useUserContext()

    const [isOpen, setIsOpen] = useState<boolean>(true)
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
                                    login(userIdInput, userNameInput);
                                    setIsOpen(false)
                                }}
                            >
                                Create User
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>

            {!isOpen &&
                <div className="flex h-screen flex-row">
                    <ServersPanel></ServersPanel>
                    <Server></Server>
                </div>
            }

        </div>
    )
}
