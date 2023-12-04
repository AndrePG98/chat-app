import { useState, useEffect, useRef } from 'react';

const useConnectToServer = () => {

    // Optimize component so it only runs if missing inial state and not after refreshing

    const [connected, setConnected] = useState(false);
    const fetchedRef = useRef<boolean>(false);


    useEffect(() => {
        const fetchDataAndConnect = async () => {
            try {
                if (!fetchedRef.current) {
                    const response = await fetch('http://127.0.0.1:8090/connect', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: "1" }),
                    });
                    if (response.ok) {
                        fetchedRef.current = true
                        console.log(response.text)
                        // Send data to WebSocket 

                        setConnected(true);
                    } else {
                        console.error('Failed to connect to server');
                    }
                }

            } catch (error) {
                console.error('Error connecting:', error);
            }
        };
        fetchDataAndConnect();

    }, []);

    return connected;
};

export default useConnectToServer;
