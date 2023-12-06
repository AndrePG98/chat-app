import { useEffect, useState } from "react";
import { useWebSocketContext } from "../contexts/WebsocketContext";
import ChatPanel from "../layouts/ChatPanel";
import useLoggedInUser from "../services/LoggedInUserService";
import { ChatMessage } from "../services/WebSocketService";
import { User } from "../DTOs/User";

export default function TextChannel(props: { channelName: string, channelId: number }) {

    const { user, login, sendWebSocketMessage, receivedMessage } = useWebSocketContext();
    const [messages, setMessages] = useState<string[]>([]);

    function createNewMessage(message: string) {
        const jsonMessage = {
            type: 1,
            body: {
                userId: user.id,
                guildId: user.guilds[0],
                channelId: "1",
                message: message
            } as ChatMessage
        }
        sendWebSocketMessage(jsonMessage)
    }


    useEffect(() => {
        console.log(receivedMessage)
        if (receivedMessage.type !== -1 && receivedMessage.body != null) {
            var body = receivedMessage.body as ChatMessage
            if (receivedMessage.type === 1) {
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
}