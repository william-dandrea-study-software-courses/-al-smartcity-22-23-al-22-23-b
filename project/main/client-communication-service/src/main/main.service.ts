import {Inject, Injectable, Logger} from '@nestjs/common';
import {NewFrequencyDto} from "./dto/new-frequency.dto";
import {WebsocketGateway} from "./websocket.gateway";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    constructor(private webSocket: WebsocketGateway) {
    }

    public get isConnected(): boolean {
        return true;
    }

    public async getHello(): Promise<any> {
        await this.webSocket.sendMessageToLicensePlate("DA-234-FD", "message_to_user", {"message": "Je t'envoie un message"})
        return "Hello World"
    }

    public async newCarFrequency(body: NewFrequencyDto) {
        this.logger.log(body);
        await this.webSocket.sendMessageToLicensePlate(body.license_plate, "new_frequency", {frequency: body.frequency})
    }
}
