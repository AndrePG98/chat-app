import React, { useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup } from "@nextui-org/react";

interface CreateChannelModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    createNewChannel: (channelName: string ,channelType : string) => void;
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ isOpen,  onOpenChange, createNewChannel }) => {
    const [channelType, setChannelType] = React.useState("");
    const [channelName, setChannelName] = useState('');

    // function createChannel() {
    //     if (channelName.trim() !== '') {
    //         const newChannel = {
    //             id: Math.floor(Math.random() * 1000) + 1,
    //             name: channelName,
    //         };
    //         props.createNewChannel(newChannel);
    //     }
    // }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='center'>
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
                                    onClose();
                                    createNewChannel(channelName, channelType);
                                    setChannelName("");
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
export default CreateChannelModal;