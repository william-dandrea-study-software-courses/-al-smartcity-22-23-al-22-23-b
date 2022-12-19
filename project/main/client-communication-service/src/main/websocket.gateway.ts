import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {Injectable} from "@nestjs/common";

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway {

    @WebSocketServer()
    server: Server;

    constructor() {}

    @SubscribeMessage('createMessage')
    async create(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket,
    ) {

        // this.server.emit('message', message);

        return body;
    }


    @SubscribeMessage('findAllMessages')
    findAll() {
        return null ;
    }

    /*
    @SubscribeMessage('join')
    joinRoom(
        @MessageBody('name') name: string,
        @ConnectedSocket() client: Socket,
    ) {
        return this.messagesService.identify(name, client.id);
    }

    @SubscribeMessage('typing')
    async typing(
        @MessageBody('isTyping') isTyping: boolean,
        @ConnectedSocket() client: Socket,
    ) {
        const name = await this.messagesService.getClientName(client.id);

        client.broadcast.emit('typing', { name, isTyping });
    }
    */


}
