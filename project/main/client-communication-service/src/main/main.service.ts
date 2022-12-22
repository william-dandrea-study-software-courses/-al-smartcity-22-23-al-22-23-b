import {Inject, Injectable, Logger} from '@nestjs/common';
import {NewFrequencyDto} from "./dto/new-frequency.dto";
import {WebsocketGateway} from "./websocket.gateway";
import {CacheServiceLicensePlate} from "./cache-license-plate.service";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    constructor(private webSocket: WebsocketGateway, private cacheService: CacheServiceLicensePlate) {
    }
    public get isConnected(): boolean {
        return true;
    }

    public async getHello(): Promise<any> {
        await this.webSocket.sendMessageToLicensePlate("AB-123", "message_to_user", {"message": "Je t'envoie un message"})

        // console.log(await this.cacheService.getIdOfLicensePlate("DA-234-FD"))
        // const r1 = await this.cacheService.setNewId("DA444", "djdjjfjfjfjfjfjf"); console.log('r1', r1);
        // await this.cacheService.debug()
        return "Hello World"
    }



    public async newCarFrequency(body: NewFrequencyDto) {
        this.logger.log(body);
        await this.webSocket.sendMessageToLicensePlate(body.license_plate, "new_frequency", {frequency: body.frequency})
    }


}
