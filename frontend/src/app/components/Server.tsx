"use client"

import React, { useState } from 'react';
import TextChannel from '../shared/components/TextChannel';
import VoiceChannel from '../shared/components/VoiceChannel';
import ChannelsPanel from '../layouts/ChannelsPanel';

const Server = () => {
    const [channels, setChannels] = useState<React.ReactNode[]>([]);

    const createNewChannel = (name: string, type: string) => {
        var newChannel: React.ReactNode;
        if(name.trim() === "") return
        if (type === 'voice') {
            newChannel =
                <VoiceChannel
                    name={name}
                    id={channels.length + 1}
                />
        } else {
            newChannel =
                <TextChannel
                    key={channels.length + 1}
                    id={channels.length + 1}
                    name={name}

                />
        }
        setChannels(prevChannels => [...prevChannels, newChannel]);
    };

    return (
        <div>
            <ChannelsPanel createNewChannel={createNewChannel} channels={channels}></ChannelsPanel>
            Chat
        </div>
    );
};

export default Server;
