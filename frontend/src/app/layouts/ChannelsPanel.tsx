import { Button, ButtonGroup } from '@nextui-org/react';
import { useState } from 'react';
import { Channel } from '../DTOs/Channel';
import CreateChannelModal from '../shared/components/CreateChannelModal';
import TextChannel from '../shared/components/TextChannel';
import VoiceChannel from '../shared/components/VoiceChannel';

export default function ChannelsPanel(props: { createNewChannel: (name: string, type: string) => void, channels: Channel[] }) {
    const [modalOpen, setModalOpen] = useState(false);

    function openModal() {
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
    }

    const addIcon = <span className="material-symbols-outlined">add</span>;

    return (
        <div>
            <h2>Channel Page</h2>
            <CreateChannelModal isOpen={modalOpen} onOpenChange={closeModal} createNewChannel={props.createNewChannel} />
            <ButtonGroup variant="light" className="flex flex-row" radius="none" size="sm" fullWidth>
                <Button isIconOnly className="flex justify-center items-center w-full" onClick={openModal}>
                    {addIcon}
                </Button>
            </ButtonGroup>
            {props.channels.map((channel) => (
                <div key={channel.id}>
                    {channel.type === 'text' && <TextChannel name={channel.name} id={channel.id} />}
                    {channel.type === 'voice' && <VoiceChannel name={channel.name} id={channel.id} />}
                </div>
            ))}
        </div>
    );
};
