import React, { useContext, useState } from 'react';
import { Button, Listbox, ListboxItem, User } from '@nextui-org/react';
import { SelectedChannelContext } from '@/app/components/Server';


export default function VoiceChannelBtn(props: { channelName: string, channelId: number }) {
    
    const [channelUsers, setChannelUsers] = useState<React.ReactNode[]>([]);
    const { selectChannel } = useContext(SelectedChannelContext);

    function addChannelUser() {
        let newUser = (
            <User
                className='flex justify-start items-center py-.5 px-.5'
                name="Jane Doe"
                avatarProps={{
                    src: "https://source.unsplash.com/random/?avatar",
                    className: "text-tiny w-5 h-5"
                }}
            />
        );
        setChannelUsers((prevChannelUsers) => [...prevChannelUsers, newUser]);
    }

    return (
        <div>
            <Button
                onPress={() => selectChannel(props.channelId)}
                className="h-8 w-full text-lg flex justify-start"
                startContent={<span className="material-symbols-outlined">volume_up</span>}
                onClick={addChannelUser}
                variant='light'
                radius='none'
            >
                {props.channelName}
            </Button>
            {channelUsers.length > 0 && (
                <Listbox
                    variant='light'
                    emptyContent=""
                    itemClasses={{
                        base: "w-1/2 left-[15%]"
                    }}
                >
                    {channelUsers.map((user, index) => (
                        <ListboxItem key={index}>{user}</ListboxItem>
                    ))}
                </Listbox>
            )}
        </div>
    );
}
