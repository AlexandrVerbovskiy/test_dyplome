import io from 'socket.io-client';
import {
    useEffect,
    useRef
} from 'react';

const serverUrl = "http://localhost:5000";

const useChatInit = () => {
    const ioRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        ioRef.current = io(serverUrl, {
            query: {
                token
            },
        });
    }, []);


}

export default useChatInit;