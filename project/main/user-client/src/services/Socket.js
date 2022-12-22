import { io } from 'socket.io-client';


export const socket = io('http://localhost:6804', {
    autoConnect: false,
    auth: {
        license_plate: null
    }
});

export const connectSocket = async (license_plate) => {
    socket.auth.license_plate = license_plate;
    await socket.disconnect().connect();
}

export function sendMessage(value) {
    socket.emit('message_topic_1', value);
}

socket.on('connection_status_server', (message) => {
    console.log(message);
});
