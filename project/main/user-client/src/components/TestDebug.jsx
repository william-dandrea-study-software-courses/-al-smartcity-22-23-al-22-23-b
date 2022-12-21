import {observer} from "mobx-react-lite";
import {connectSocket, sendMessage} from "../services/Socket";
import io from 'socket.io-client';
import { useEffect, useState } from 'react';


export const TestDebug = () => {



    const connectToSocket = async () => {
        await connectSocket("DA-234-FD")
    }

    const sendMessage2 = () => {
        sendMessage({"message": "this message come from me, the client"})
    };

    return <>
        <button onClick={connectToSocket}>Connect to socket</button>
        <button onClick={sendMessage2}>Send Message</button>
    </>
}
