"use client"

import { useState } from 'react';
import ChannelsPanel from '../layouts/ChannelsPanel';
import { Channel } from '../DTOs/Channel';

import React from 'react'

export default function Server() {
    const [channels, setChannels] = useState<Channel[]>([]);

    const createNewChannel = (name: string, type: string) => {
        const newChannel = new Channel(channels.length+1, name, type);
        setChannels(prevChannels => [...prevChannels, newChannel]);
    };

    return (
        <div className='relative bottom-0 left-0'>
            <ChannelsPanel createNewChannel={createNewChannel} channels={channels}></ChannelsPanel>
        </div>
    );
};
