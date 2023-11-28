"use client"

import { useState, createContext } from 'react';
import ChannelsPanel from '../layouts/ChannelsPanel';
import { Channel } from '../DTOs/Channel';

import React from 'react'
import TextChannel from './TextChannel';
import VoiceChannel from './VoiceChannel';
import { Button } from '@nextui-org/react';
import { Console } from 'console';




export const SelectedChannelContext = createContext<{
    selectedChannel: Channel | undefined;
    selectChannel: (channelId: number) => void;
    createNewChannel: (name: string, type: string) => void;
}>({
    selectedChannel: undefined,
    selectChannel: (channelId: number) => { },
    createNewChannel: (name: string, type: string) => { }
});

export default function Server() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>(undefined);

    const createNewChannel = (name: string, type: string) => {
        const newChannel = new Channel(channels.length + 1, name, type);
        setChannels(prevChannels => [...prevChannels, newChannel]);
    };

    const selectChannel = (channelId: number) => {
        setSelectedChannel(channels.find((channel) => channel.id === channelId));
    };

    return (
        <div className='server flex-1 flex flex-row'>
            <SelectedChannelContext.Provider value={{ selectedChannel, selectChannel, createNewChannel }}>
                <ChannelsPanel channels={channels}></ChannelsPanel>
            </SelectedChannelContext.Provider>
            {selectedChannel?.type === "text" && <TextChannel channelName={selectedChannel.name} channelId={selectedChannel.id} ></TextChannel>}
            {selectedChannel?.type === "voice" && <VoiceChannel channelName={selectedChannel.name} channelId={selectedChannel.id} ></VoiceChannel>}
        </div>
    );
};
