"use client"

import React, { useState } from 'react';
import { Divider, Button, Input, RadioGroup, Radio, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, User, useDisclosure } from '@nextui-org/react';
import VoiceChannel from '../shared/components/VoiceChannel';
import TextChannel from '../shared/components/TextChannel';

export default function MainPage() {
    const [channels, setChannels] = useState<React.ReactNode[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [channelName, setChannelName] = useState('');
    const [channelType, setChannelType] = React.useState("");
    const validOptions = ["text", "voice"];
    const isInvalid = !validOptions.includes(channelType);

    function createChannel() {
        if (channelName.trim() !== '') {
            let channel : React.ReactNode = null;
            if(channelType === 'voice'){
                channel = <VoiceChannel name={channelName}/>
            } else {
                channel = <TextChannel name={channelName}/>
            }
            setChannels((prevChannels) => [...prevChannels, channel]);
        }
    }

    const addIcon = <span className="material-symbols-outlined">add</span>

    return (
        <div className='h-screen w-fit flex-1 flex flex-row'>
            <div className='basis-52 shrink-0 grow-0 border-r flex flex-col items-stretch justify-start py-6 px-3'>
                <div className='text-center mb-10'>Group Name</div>
                <div className='flex flex-row mb-5'>
                    <Button isIconOnly color="success" className='flex justify-center items-center' onPress={onOpen}>
                        {addIcon}
                    </Button>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='center'>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader
                                        className="flex flex-col gap-1">
                                        What's the channel type?
                                    </ModalHeader>
                                    <ModalBody>
                                        <RadioGroup value={channelType} onValueChange={setChannelType} isInvalid={isInvalid}>
                                            <Radio value="voice">Voice</Radio>
                                            <Radio value="text">Text</Radio>
                                        </RadioGroup>
                                    </ModalBody>
                                    <ModalHeader className="flex flex-col gap-1">
                                        What should the channel be called?
                                    </ModalHeader>
                                    <ModalBody>
                                        <Input
                                            type="name"
                                            label="Channel Name"
                                            placeholder="Enter the desired channel name"
                                            value={channelName}
                                            onChange={(e) => setChannelName(e.target.value)}
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button
                                            className='w-full'
                                            color="success"
                                            onClick={() => {
                                                createChannel()
                                                onClose();
                                                setChannelName('');
                                                setChannelType("");
                                            }}
                                            endContent={<span className="material-symbols-outlined">add</span>}>
                                            Create channel
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
                <div className='channels-list flex flex-col gap-3'>
                    {channels.map((channel, index) => (
                        <div key={index}>{channel}</div>
                    ))}
                </div>
            </div>
            <Divider className='w-1' orientation='vertical'></Divider>
            <div className='flex-1'></div>
        </div>
    );
}
