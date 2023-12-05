import { useState, useEffect, useRef } from 'react';

const useConnectToServer = () => {

    // Optimize component so it only runs if missing inial state and not after refreshing

    const [connected, setConnected] = useState(false);
    const fetchedRef = useRef<boolean>(false);

    const fetchDataAndConnect = async () => {
        try {
            if (!fetchedRef.current) {
                const response = await fetch(`http://127.0.0.1:8090/connect?id=${"1"}`, {
                    method: 'GET'
                });
                //const result = await response.text()
                if (response.ok) {
                    fetchedRef.current = true
                    setConnected(true);
                } else {
                    console.error('Failed to connect to server');
                }
            }

        } catch (error) {
            console.error('Error connecting:', error);
        }
    };


    useEffect(() => {
        fetchDataAndConnect();
    }, []);

    return connected;
};

export default useConnectToServer;
