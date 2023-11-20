"use client"

import React, { ReactNode, useState } from 'react';
import { Divider, Button, useDisclosure, ButtonGroup } from '@nextui-org/react';
import CreateChannelModal from '../shared/components/CreateChannelModal';
import ChatPage from './ChatPage';

export default function MainPage() {
    const [channels, setChannels] = useState<React.ReactNode[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function setChannel(channel: ReactNode) {
        setChannels((prevChannels) => [...prevChannels, channel]);
    }

    const addIcon = <span className="material-symbols-outlined">add</span>

    return (
        <div className='h-screen w-fit flex-1 flex flex-row'>
            <div className='w-64 h-full flex flex-col pt-2  border-r border-gray-700'>
                <div className='header flex flex-col justify-center items-center pb-5'>
                    <div className='text-2xl'>Group Name</div>
                </div>
                <Divider />
                <div className='body flex flex-col py-5 flex-grow'>
                    {channels.map((channel, index) => (
                        <div key={index}>{channel}</div>
                    ))}
                </div>
                <Divider />
                <div className='footer '>
                    <ButtonGroup variant='light' className='flex flex-row' radius='none' size='sm' fullWidth>
                        <Button isIconOnly className='flex justify-center items-center w-full' onClick={onOpen}>
                            {addIcon}
                        </Button>
                    </ButtonGroup>
                    <CreateChannelModal onOpen={onOpen} isOpen={isOpen} onOpenChange={onOpenChange} setChannels={setChannel} />
                </div>
            </div>
            <div className='flex-1'>
                <ChatPage></ChatPage>
            </div>
        </div>
    );
}
