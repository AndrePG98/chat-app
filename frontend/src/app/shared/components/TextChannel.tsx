import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import Message from './Message';

interface TextChannelProps {
    name: string;
    id: number;
}

const TextChannel: React.FC<TextChannelProps> = (props) => {

    const [messages, setMessages] = useState<string[]>([]);

    const createNewMessage = () => {
        setMessages((prevMessages) => [...prevMessages, "new messagge"]);
    };

    return (
        <div>
            <Button
                className="h-8 w-full text-lg flex justify-start"
                startContent={<span className="material-symbols-outlined">edit</span>}
                variant='light'
                radius='none'
            >
                {props.name}
            </Button>
            <div>
                <h1>Message List</h1>
                {messages.map((message) => (
                    <Message message={message}></Message>
                ))}
                <button onClick={createNewMessage}>Create New Message</button>
            </div>
        </div>
    );
};

export default TextChannel;
