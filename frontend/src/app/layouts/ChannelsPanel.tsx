import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import CreateChannelModal from '../shared/components/CreateChannelModal';

interface ChannelsPageProps {
    createNewChannel: (channelName:string) => void
}

const ChannelsPage: React.FC<ChannelsPageProps> = ({ createNewChannel }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleCreateChannel = (channelName: string) => {
        createNewChannel(channelName);
        closeModal();
    };

    return (
        <div>
            <h2>Channel Page</h2>
            <CreateChannelModal isOpen={modalOpen} onOpen={openModal} onOpenChange={closeModal} createNewChannel={handleCreateChannel} />
            <Button onClick={openModal}>Create New Channel</Button>
        </div>
    );
};

export default ChannelsPage;
