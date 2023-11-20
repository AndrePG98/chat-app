"use client"

import React, { ReactNode, useState } from 'react';
import { Divider, Button, useDisclosure, ButtonGroup } from '@nextui-org/react';
import CreateChannelModal from '../shared/components/CreateChannelModal';

export default function MainPage() {
    const [channels, setChannels] = useState<React.ReactNode[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function setChannel(channel: ReactNode) {
        setChannels((prevChannels) => [...prevChannels, channel]);
    }

    const addIcon = <span className="material-symbols-outlined">add</span>

    return (
        <div className='h-screen w-fit flex-1 flex flex-row'>
            <div className='border-r w-64 h-full flex flex-col py-2'>
                <div className='header flex flex-col justify-start items-center gap-3'>
                    <div className='text-2xl'>Group Name</div>
                    <ButtonGroup variant='light' className='flex flex-row' radius='none' size='sm' fullWidth>
                        <Button isIconOnly className='flex justify-center items-center w-full' onClick={onOpen}>
                            {addIcon}
                        </Button>
                    </ButtonGroup>
                    <CreateChannelModal onOpen={onOpen} isOpen={isOpen} onOpenChange={onOpenChange} setChannels={setChannel} />
                </div>
                <Divider/>
                <div className='flex flex-col py-5'>
                    {channels.map((channel, index) => (
                        <div key={index}>{channel}</div>
                    ))}
                </div>
            </div>
            <div className='flex-1'></div>
        </div>
    );
}
