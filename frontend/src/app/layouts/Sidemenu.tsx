'use client';

import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, User, useDisclosure } from '@nextui-org/react';
import React, { useState } from 'react';

export default function Sidemenu() {
    const [buttons, setButtons] = useState<React.ReactNode[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [channelName, setChannelName] = useState('');

    function createButton() {
        if (channelName.trim() !== '') {
            const newButton = (
                <Button key={channelName} className='w-full' endContent={<span className="material-symbols-outlined ml-8">edit</span>}>
                    {channelName}
                </Button>
            );
            setButtons((prevButtons) => [...prevButtons, newButton]);
        }
    }

    return (
        <aside className='h-screen transition-all duration-300 ease-in-out py-5 px-4 border-r border-gray-700 flex flex-col absolute inset-y-0 left-0 w-60'>
            <nav className='flex justify-center items-center'>
                <div className='space-y-3'>
                    <User
                        name="Jane Doe"
                        description="Product Designer"
                        avatarProps={{
                            src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                        }}
                    />
                    <Divider className='w-52'></Divider>
                    <div className="flex justify-center flex-col space-y-3">
                    </div>
                </div>
            </nav>
        </aside>
    );
}
