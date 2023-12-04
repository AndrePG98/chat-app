import { useState, useContext } from "react";
import ChatPanel from "../layouts/ChatPanel";
import { Button } from "@nextui-org/button";
import { useWebSocketContext } from "../contexts/WebsocketContext";

export default function TextChannel(props: { channelName: string, channelId: number }) {

    const { sendWebSocketMessage, receivedMessage } = useWebSocketContext();

    const [messages, setMessages] = useState<string[]>([]);

    function createNewMessage(message: string) {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    return (
        <div className="text-channel h-full flex-1">
            <div className="flex flex-row">
                <Button onPress={() => { sendWebSocketMessage("Test") }}>Send</Button>
                <textarea className="text-xl" value={receivedMessage.type + receivedMessage.payload} readOnly></textarea>
            </div>
            <ChatPanel channelId={props.channelId} createNewMessage={createNewMessage} messages={messages}></ChatPanel>
        </div>
    );
};