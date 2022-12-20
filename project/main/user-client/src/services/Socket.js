import { io } from 'socket.io-client';

const socket = io('http://localhost:6804');


function sendMessage() {
    socket.emit('findAllMessages', {},  (messages) => {
        console.log(messages)
    });
}

/*

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
} */
