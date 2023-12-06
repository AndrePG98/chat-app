import { useState } from "react";
import ChatPanel from "../layouts/ChatPanel";
import sendData from "../services/sendMessageService";

export default function TextChannel(props: { channelName: string, channelId: number }) {

    const [messages, setMessages] = useState<string[]>([]);

    function createNewMessage(message: string) {
        sendData("1", props.channelId.toString(), message)
    }

    return (
        <div className="text-channel h-full flex-1">
            <ChatPanel channelId={props.channelId} createNewMessage={createNewMessage} messages={messages}></ChatPanel>
        </div>
    )
}