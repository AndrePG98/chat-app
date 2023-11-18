"use client"

import React, { useState } from 'react';
import { Divider, Button, Popover, PopoverTrigger, PopoverContent, Input, RadioGroup, Radio } from '@nextui-org/react';
import VoiceChannel from '../shared/components/VoiceChannel';
import TextChannel from '../shared/components/TextChannel';

export default function MainPage() {

    const [channels, setChannels] = useState([])

    const addIcon = <span className="material-symbols-outlined">add</span>

    return (
        <div className='h-screen w-fit flex-1 flex flex-row'>
            <div className='basis-52 shrink-0 grow-0 border-r flex flex-col items-stretch justify-start py-6 px-3'>
                <div className='text-center mb-10'>Group Name</div>
                <div className='flex flex-row mb-5'>
                    <Popover showArrow={true} placement="bottom" offset={20}>
                        <PopoverTrigger>
                            <Button isIconOnly color="success" className='flex justify-center items-center'>
                                {addIcon}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='flex flex-col items-stretch justify-start gap-4 p-5'>
                            <RadioGroup className=''>
                                <Radio value="voice">Voice Channel</Radio>
                                <Radio value="text">Text Channel</Radio>
                            </RadioGroup>
                            <Input type="channelName" label="Channel Name" placeholder="Enter new channel name" className='' />
                            <Button color='success'>Add</Button>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className='channels-list flex flex-col gap-3'>
                    <VoiceChannel name={"VoiceChannel 2"}></VoiceChannel>
                    <VoiceChannel name={"VoiceChannel 2"}></VoiceChannel>
                    <TextChannel name={"TextChannel 1"}></TextChannel>
                </div>
            </div>
            <Divider className='w-1' orientation='vertical'></Divider>
            <div className='flex-1'></div>
        </div>
    );
}
