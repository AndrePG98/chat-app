import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import Message from './Message';

interface TextChannelProps {
    name: string;
    id: number;
    messages: string[];
}

const TextChannel: React.FC<TextChannelProps> = (props) => {

    const [messages, setMessages] = useState<React.ReactNode[]>(props.messages.map((message) => (
        <Message message={message} />
    )));

    const createNewMessage = () => {
        const newMessageComponent = <Message key={messages.length} message={'example message'} />;
        setMessages((prevMessages) => [...prevMessages, newMessageComponent]);
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
                {messages}
                <button onClick={createNewMessage}>Create New Message</button>
            </div>
        </div>
    );
};

export default TextChannel;
