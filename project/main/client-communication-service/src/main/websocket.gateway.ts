import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {CacheServiceLicensePlate} from "./cache-license-plate.service";

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

    @WebSocketServer()
    server: Server;

    private usersConnected = {};
    private logger: Logger = new Logger(WebsocketGateway.name);

    constructor(private cacheService: CacheServiceLicensePlate) {}

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.log(`Client connected: ${client.handshake.auth.license_plate}`);
        // this.usersConnected[client.handshake.auth.license_plate] = client.id;
        await this.cacheService.setNewId(client.handshake.auth.license_plate, client.id);

        this.server.to(client.id).emit('connection_status_server', {"status": "Connection established"})
    }

    @SubscribeMessage('message_topic_1')
    handleMessage(client: Socket, payload: any): void {
        this.logger.log(`New message from one client with ID ${this.usersConnected[client.handshake.auth.license_plate]} (license_plate : ${client.handshake.auth.license_plate}) : ${payload}`);
    }

    public async sendMessageToLicensePlate(license_plate: string, topic: string, message: any): Promise<void> {
        //const idUser = this.usersConnected[license_plate];
        const idUser = await this.cacheService.getIdOfLicensePlate(license_plate);

        if (idUser != null) {
            this.server.to(idUser).emit(topic, message);
        } else {
            throw new HttpException(`The user with the license_plate ${license_plate} is not connected`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    handleDisconnect(client: Socket) {
        delete this.usersConnected[client.handshake.auth.license_plate];
        this.logger.log(`Client disconnected: ${client.id}`);
    }
}
