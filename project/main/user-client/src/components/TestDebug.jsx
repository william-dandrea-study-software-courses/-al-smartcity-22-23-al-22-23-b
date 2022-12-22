import {observer} from "mobx-react-lite";
import {SocketService} from "../services/Socket";
import io from 'socket.io-client';
import { useEffect, useState } from 'react';


export const TestDebug = () => {

    const [licensePlate, setLicensePlate] = useState('');

    useEffect(() => {
        SocketService.socket.on('message_to_user', (message) => {
            console.log(message)
        });

        SocketService.socket.on('new_frequency', (message) => {
            console.log(message)
        });
    }, []);

    const connectToSocket = async () => {
        await SocketService.connectSocket(licensePlate)
    }

    const sendMessage2 = () => {
        SocketService.sendMessage({"message": "this message come from me, the client"})
    };

    return <>
        <input type="text" value={licensePlate} onChange={e => setLicensePlate(e.target.value)} placeholder="Your license plate" />
        <button onClick={connectToSocket}>Connect to socket</button>
        <button onClick={sendMessage2}>Send Message</button>
    </>
}
