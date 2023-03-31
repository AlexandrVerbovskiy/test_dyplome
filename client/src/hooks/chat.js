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

        ioRef.current.on("created-chat", data => console.log("created: ", data));
    }, []);

    const createChat = (userId) => {
        ioRef.current.emit('create-personal-chat', {
            userId,
            typeMessage: "test",
            content: "test"
        });
    }

    return {
        createChat
    };
}

export default useChatInit;