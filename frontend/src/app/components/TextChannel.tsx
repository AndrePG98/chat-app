import { useState, useEffect } from "react";
import ChatPanel from "../layouts/ChatPanel";
import { useWebSocketContext } from "../contexts/WebsocketContext";

export default function TextChannel(props: { channelName: string, channelId: number }) {

    const { sendWebSocketMessage, receivedMessage } = useWebSocketContext();

    const [messages, setMessages] = useState<string[]>([]);

    function createNewMessage(message: string) {
        const jsonMessage = {
            type : 1,

            body : {
                UserID : 1,
                ServerID : 0,
                ChannelID : props.channelId,
                Message : message
            }
        }
        sendWebSocketMessage(jsonMessage)
    };

    useEffect(() => {
        if (receivedMessage.payload !== "" && receivedMessage.type !== "") {
            setMessages((prevMessages) => [...prevMessages, receivedMessage.payload]);
        }
    }, [receivedMessage])

    return (
        <div className="text-channel h-full flex-1">
            {/* <div className="flex flex-row">
                <Button onPress={() => { sendWebSocketMessage("Test") }}>Send</Button>
                <textarea className="text-xl" value={receivedMessage.type + receivedMessage.payload} readOnly></textarea>
            </div> */}
            <ChatPanel channelId={props.channelId} createNewMessage={createNewMessage} messages={messages}></ChatPanel>
        </div>
    );
};