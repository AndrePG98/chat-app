'use client'

import React, { useState } from 'react';
import { Divider, Button, useDisclosure, ButtonGroup } from '@nextui-org/react';
import CreateChannelModal from '../shared/components/CreateChannelModal';
import ChatPage from './ChatPage';

// ... (your existing imports)

export default function ChannelsPanel() {
    const [channels, setChannels] = useState([
        { id: 1, name: 'General' },
        { id: 2, name: 'Random' },
    ]);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedChannel, setSelectedChannel] = useState(null);

    const handleChannelClick = (channelId: any) => {
        setSelectedChannel(channelId);
    };

    const leaveChannel = () => {
        setSelectedChannel(null);
    };

    const setChannel = (channel: { id: number; name: string }) => {
        setChannels((prevChannels) => [...prevChannels, channel]);
    };

    const addIcon = <span className="material-symbols-outlined">add</span>;

    return (
        <div className="h-screen w-fit flex-1 flex flex-row">
            <div className="w-64 h-full flex flex-col pt-2 border-r border-gray-700">
                <div className="header flex flex-col justify-center items-center pb-5">
                    <div className="text-2xl">Group Name</div>
                </div>
                <Divider />
                <div className="body flex flex-col py-5 flex-grow">
                    {channels.map((channel) => (
                        <div key={channel.id} onClick={() => handleChannelClick(channel.id)}>
                            {channel.name}
                        </div>
                    ))}
                </div>
                <Divider />
                <div className="footer">
                    <ButtonGroup variant="light" className="flex flex-col" radius="none" size="sm" fullWidth>
                        {selectedChannel && (
                            <Button color="danger" onClick={leaveChannel}>
                                Leave Channel
                            </Button>
                        )}
                        <Button isIconOnly className="flex justify-center items-center w-full" onClick={onOpen}>
                            {addIcon}
                        </Button>

                    </ButtonGroup>
                    <CreateChannelModal onOpen={onOpen} isOpen={isOpen} onOpenChange={onOpenChange} setChannels={setChannel} />

                </div>
            </div>
            <div>

                {selectedChannel && <ChatPage channelId={selectedChannel} />}
            </div>
        </div>
    );
}
