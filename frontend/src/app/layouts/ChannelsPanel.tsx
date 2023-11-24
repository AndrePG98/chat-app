"use client"

import React, { useState } from 'react';
import { Divider, Button, useDisclosure, ButtonGroup } from '@nextui-org/react';
import CreateChannelModal from '../shared/components/CreateChannelModal';
import ChatPage from './ChatPage';
import Message from '../shared/components/Message';

export default function ChannelsPanel() {
    const [channels, setChannels] = useState([
        { id: 1, name: 'General' },
        { id: 2, name: 'Random' },
    ]);

    const [selectedChannel, setSelectedChannel] = useState(null);
    const [channelMessages, setChannelMessages] = useState<{ [key: number]: React.ReactNode[] }>({});

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleChannelClick = (channelId: any) => {
        setSelectedChannel(channelId);
    };

    const leaveChannel = () => {
        setSelectedChannel(null);
    };

    const setChannel = (channel: { id: number; name: string }) => {
        setChannels((prevChannels) => [...prevChannels, channel]);
        setChannelMessages((prevMessages) => ({ ...prevMessages, [channel.id]: [] }));
    };

    const addMessage = (message: string) => {
        if (selectedChannel !== null && message !== "") {
            setChannelMessages((prevMessages) => ({
                ...prevMessages,
                [selectedChannel]: [...(prevMessages[selectedChannel] || []), <Message message={message} key={Date.now()} />],
            }));
        }
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
                        <Button className="m-1" radius="sm" key={channel.id} onClick={() => handleChannelClick(channel.id)}>
                            {channel.name}
                        </Button>
                    ))}
                </div>
                <Divider />
                <div className="footer">
                    <ButtonGroup variant="light" className="flex flex-col" radius="none" size="sm" fullWidth>
                        <Button isIconOnly className="flex justify-center items-center w-full" onClick={onOpen}>
                            {addIcon}
                        </Button>
                        {selectedChannel && (
                            <Button color="danger" onClick={leaveChannel}>
                                Leave Channel
                            </Button>
                        )}
                    </ButtonGroup>
                </div>
            </div>
            <div>
                {selectedChannel && (
                    <div>
                        <h2>{channels.find((channel) => channel.id === selectedChannel)?.name}</h2>
                        {channelMessages[selectedChannel] && channelMessages[selectedChannel].map((message) => message)}
                        <ChatPage channelId={selectedChannel} addMessage={addMessage} />
                    </div>
                )}
            </div>
            <CreateChannelModal onOpen={onOpen} isOpen={isOpen} onOpenChange={onOpenChange} setChannels={setChannel} />
        </div>
    );
}
