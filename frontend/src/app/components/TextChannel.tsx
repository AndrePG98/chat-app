import { useState, useEffect } from "react";
import ChatPanel from "../layouts/ChatPanel";
import { useWebSocketContext } from "../contexts/WebsocketContext";
import { ChatMessage } from "../services/WebSocketService";

export default function TextChannel(props: { channelName: string, channelId: number }) {

    const { sendWebSocketMessage, receivedMessage } = useWebSocketContext();

    const [messages, setMessages] = useState<string[]>([]);

    function createNewMessage(message: string) {
        /* const jsonMessage = {
            type : 1,
            body : {
                UserId : "1",
                GuildId : "1",
                ChannelId : "1",
                Message : message
            }
        }
        sendWebSocketMessage(jsonMessage) */
    };


    useEffect(() => {
        console.log(receivedMessage)
        if (receivedMessage.type !== -1 && receivedMessage.body != null) {
            var body =receivedMessage.body as ChatMessage
            if(receivedMessage.type === 1){
                setMessages((prevMessages) => [...prevMessages, body.message]);   
            }
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