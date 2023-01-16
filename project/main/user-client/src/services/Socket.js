import { io } from 'socket.io-client';


const socket = io('http://localhost:6804', {
    autoConnect: false,
    auth: {
        license_plate: null
    }
});

const connectSocket = async (license_plate) => {
    socket.auth.license_plate = license_plate;
    await socket.disconnect().connect();
}

const sendMessage = (value) => {
    socket.emit('message_topic_1', value);
}

socket.on('connection_status_server', (message) => {
    console.log(message);
});


export const SocketService = {
    socket,
    connectSocket,
    sendMessage,
}
