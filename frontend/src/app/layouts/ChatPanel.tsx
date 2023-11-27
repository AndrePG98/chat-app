import { Button, Input } from '@nextui-org/react';
import React, { useEffect, useRef } from 'react';

interface ChatPageProps {
    channelId: number;
    addMessage: (message: string) => void;
}

export default function ChatPage({ channelId, addMessage }: ChatPageProps) {
    const [input, setInput] = React.useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [channelId]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && input !== '') {
            event.preventDefault();
            addMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full px-3">
            <div ref={chatContainerRef} className="flex flex-col gap-10 message-container overflow-y-auto flex-1 w-full pt-5 px-3 pb-3">
                {channelId !== null && (
                    <div>
                        <Input
                            className=""
                            radius="md"
                            variant="bordered"
                            placeholder="Say something..."
                            value={input}
                            onValueChange={setInput}
                            onKeyDown={handleKeyPress}
                            endContent={
                                <Button
                                    isIconOnly
                                    className="bg-transparent outline-none"
                                    color="primary"
                                    disableRipple
                                    variant="flat"
                                    onPress={() => {
                                        addMessage(input);
                                        setInput("");
                                    }}
                                >
                                    <span className="material-symbols-outlined">send</span>
                                </Button>
                            }
                        ></Input>
                    </div>
                )}
            </div>
        </div>
    );
}
