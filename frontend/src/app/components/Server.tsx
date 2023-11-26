"use client"

import React, { useState } from 'react';
import TextChannel from '../shared/components/TextChannel';
import ChannelsPanel from '../layouts/ChannelsPanel';

const Server = () => {
    const [channels, setChannels] = useState([
        <TextChannel key={1} id={1} name="Channel 1" messages={[]} />,
        <TextChannel key={2} id={2} name="Channel 2" messages={[]} />,
    ]);

    const createNewChannel = (name: string) => {
        const newChannel = (
            <TextChannel
                key={channels.length + 1}
                id={channels.length + 1}
                name={name}
                messages={[]}
            />
        );

        setChannels(prevChannels => [...prevChannels, newChannel]);
    };

    return (
        <div>
            <ChannelsPanel createNewChannel={createNewChannel}></ChannelsPanel>
            {channels}
        </div>
    );
};

export default Server;
