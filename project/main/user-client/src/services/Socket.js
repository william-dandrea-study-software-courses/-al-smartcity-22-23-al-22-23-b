import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');


function connection() {
    socket.emit('findAllMessages', {},  (messages) => {
        console.log(messages)
    });

    socket.on('message', (message) => {
        console.log((prev) => [...prev, message]);
    });

    socket.on('typing', ({name, isTyping}) => {
        console.log(name, isTyping)
    });
}


function join(e) {
    e.preventDefault();

    socket.emit('join', { name }, () => setJoined(true));

    connection();
}

function sendMessage(e) {
    e.preventDefault();

    socket.emit('createMessage', { text }, () => {
        console.log("")
    });
}

function emitTyping(e) {
    console.log(e.target.value);

    socket.emit('typing', { isTyping: true });

    setTimeout(() => {
        socket.emit('typing', { isTyping: false });
    }, 2000);
}
