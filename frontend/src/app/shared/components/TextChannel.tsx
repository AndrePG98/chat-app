import ChatPanel from '@/app/layouts/ChatPanel';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import Message from './Message';

export default function TextChannel(props: { channelName: string, channelId: number }) {

    const [messages, setMessages] = useState<string[]>([]);

    function createNewMessage(message: string) {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    return (
        <div>
            <Button
                className="h-8 w-full text-lg flex justify-start"
                startContent={<span className="material-symbols-outlined">edit</span>}
                variant='light'
                radius='none'
            >
                {props.channelName}
            </Button>
            <div>
                <h1>Message List</h1>
                {messages.map((message) => (
                    <Message message={message} key={messages.length}></Message>
                ))}
            </div>
            <ChatPanel channelId={props.channelId} createNewMessage={createNewMessage}></ChatPanel>
        </div>
    );
};
