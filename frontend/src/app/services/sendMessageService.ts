/* const useSendMessage = () => {

    const sendData = async (serverId : string, channelId : string, message : string) => {
        try {
            const response = await fetch(`http://127.0.0.1:8090/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId : "1",
                    serverId : serverId,
                    channelId : channelId,
                    message : message
                })
            });
            //const result = await response.text()
            if (response.ok) {
                console.log("Message sent")
            } else {
                console.error('Failed to connect to server');
            }
    
        } catch (error) {
            console.error('Error connecting:', error);
        }
    };

    return sendData;
}; */

export default async function sendData (serverId : string, channelId : string, message : string) {
    try {
        const response = await fetch(`http://127.0.0.1:8090/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId : "1",
                serverId : serverId,
                channelId : channelId,
                message : message
            })
        });
        //const result = await response.text()
        if (response.ok) {
            console.log("Message sent")
        } else {
            console.error('Failed to connect to server');
        }

    } catch (error) {
        console.error('Error connecting:', error);
    }
}
