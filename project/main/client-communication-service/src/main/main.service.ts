import {Inject, Injectable, Logger} from '@nestjs/common';
import {NewFrequencyDto} from "./dto/new-frequency.dto";
import {WebsocketGateway} from "./websocket.gateway";
import {CacheServiceLicensePlate} from "./cache-license-plate.service";
import {RouteDto} from "./dto/route.dto";
import {PrometheusService} from "../prometheus/prometheus.service";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);
    // private numberOfCarAskingRouteGauge = this.prometheusService.registerGauge("number_of_car_asking_route_requests", "number_of_car_asking_route_requests")

    private serviceUp = this.prometheusService.registerGauge("service_up", "service_up")
    // this.serviceUp.set(1);
    constructor(
        private webSocket: WebsocketGateway,
        private cacheService: CacheServiceLicensePlate,
        private prometheusService: PrometheusService
    ) {
        this.serviceUp.set(1);
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

    public async sendRoute(route: RouteDto){
        await this.webSocket.sendMessageToLicensePlate(route.license_plate, "new_route", {route: route.route, price:route.price})
    }


    public async newCarFrequency(body: NewFrequencyDto) {
        await this.webSocket.sendMessageToLicensePlate(body.license_plate, "new_frequency", {frequency: body.frequency})
    }


}
