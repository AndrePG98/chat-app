import { useState } from "react";
import ChatPanel from "../layouts/ChatPanel";
import useSendMessage from "../services/sendMessageService";

export default function TextChannel(props: { channelName: string, channelId: number }) {

    const [messages, setMessages] = useState<string[]>([]);

    const sendMessage = useSendMessage()

    function createNewMessage(message: string) {
        sendMessage("1", props.channelId.toString(), message)
        setMessages((prevMessages) => [...prevMessages, message]);
    }

    return (
        <div className="text-channel h-full flex-1">
            <ChatPanel channelId={props.channelId} createNewMessage={createNewMessage} messages={messages}></ChatPanel>
        </div>
    )
}