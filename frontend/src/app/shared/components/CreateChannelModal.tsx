import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Radio,
    RadioGroup,
} from "@nextui-org/react";
import React, { useState } from "react";

interface CreateChannelModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: () => void;
    setChannels: (channel: { id: number; name: string }) => void;
}

export default function CreateChannelModal(props: CreateChannelModalProps) {
    const [channelType, setChannelType] = React.useState("");
    const [channelName, setChannelName] = useState('');

    function createChannel() {
        if (channelName.trim() !== '') {
            const newChannel = {
                id: Math.floor(Math.random() * 1000) + 1, // Example: generate a random ID
                name: channelName,
            };
            props.setChannels(newChannel);
        }
    }

    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} placement='center'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            What's the channel type?
                        </ModalHeader>
                        <ModalBody>
                            <RadioGroup value={channelType} onValueChange={setChannelType}>
                                <Radio value="voice">Voice</Radio>
                                <Radio value="text">Text</Radio>
                            </RadioGroup>
                        </ModalBody>
                        <ModalHeader className="flex flex-col gap-1">
                            What should the channel be called?
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                type="name"
                                label="Channel Name"
                                placeholder="Enter the desired channel name"
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}>
                                Close
                            </Button>
                            <Button
                                className='w-full'
                                color="success"
                                onClick={() => {
                                    createChannel()
                                    onClose();
                                    setChannelName('');
                                    setChannelType("");
                                }}
                                endContent={<span className="material-symbols-outlined">add</span>}>
                                Create channel
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
