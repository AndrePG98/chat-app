import { useEffect, useState } from "react";
import { useWebSocketContext } from "../contexts/WebsocketContext";
import ChatPanel from "../layouts/ChatPanel";
import useLoggedInUser from "../services/LoggedInUserService";
import { ChatMessage } from "../services/WebSocketService";
import { User } from "../DTOs/User";

export default function TextChannel(props: { channelName: string, channelId: number }) {

    const { sendWebSocketMessage, receivedMessage } = useWebSocketContext();
    const [messages, setMessages] = useState<string[]>([]);
    const {userId, guilds }=useLoggedInUser()
    
    function createNewMessage(message: string) {
        const testUser = new User("2", "testName", "65")
        const jsonMessage = {
            type : 1,
            body : {
                UserId : testUser.id,
                GuildId : testUser.guilds,
                ChannelId : "1",
                Message : message
            }
        }
        sendWebSocketMessage(jsonMessage)
    }


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
}