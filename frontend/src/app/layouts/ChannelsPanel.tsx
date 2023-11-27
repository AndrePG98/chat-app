import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import CreateChannelModal from '../shared/components/CreateChannelModal';

interface ChannelsPageProps {
    createNewChannel: (channelName: string, channelType: string) => void,
    channels: React.ReactNode[]
}

const ChannelsPanel: React.FC<ChannelsPageProps> = ({ createNewChannel, channels }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);

    const closeModal = () => setModalOpen(false);

    return (
        <div>
            <h2>Channel Page</h2>
            <CreateChannelModal isOpen={modalOpen} onOpenChange={closeModal} createNewChannel={createNewChannel} />
            <Button onClick={openModal}>Create New Channel</Button>
            {channels}
        </div>
    );
};

export default ChannelsPanel;
