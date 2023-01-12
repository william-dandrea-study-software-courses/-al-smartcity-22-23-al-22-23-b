import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from "@nestjs/microservices";
import { NewCarPositionDto } from './dto/new-car-position.dto';
import {AskRouteDto} from "./dto/ask-route.dto";
import {PrometheusService} from "../prometheus/prometheus.service";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    private numberOfCarStartGauge = this.prometheusService.registerGauge("number_of_car_start_requests", "number_of_car_start_requests")
    private numberOfCarStopGauge = this.prometheusService.registerGauge("number_of_car_stop_requests", "number_of_car_stop_requests")
    private numberOfCarPositionGauge = this.prometheusService.registerGauge("number_of_car_position_requests", "number_of_car_position_requests")
    private numberOfCarAskingRouteGauge = this.prometheusService.registerGauge("number_of_car_asking_route_requests", "number_of_car_asking_route_requests")

    constructor(
        @Inject('USER_POSITION_BUS') private readonly kafkaClient: ClientKafka,
        private prometheusService: PrometheusService
    ) { }

    public get isConnected(): boolean {
        return true;
    }

    public async getHello(): Promise<string> {
        await this.kafkaClient.emit(
            'position_pattern',
            'salut toi'
        );

        return "Hello World"
    }

    public async sendPosition(data: NewCarPositionDto): Promise<string> {
        this.numberOfCarPositionGauge.inc(1);
        await this.kafkaClient.emit(
            'car-position',
            data
        );

        return "Position sent"
    }

    public async sendStart(data: NewCarPositionDto): Promise<string> {
        this.numberOfCarStartGauge.inc(1);
        await this.kafkaClient.emit(
            'car-start',
            data
        );

        return "Start sent"
    }

    public async sendStop(data: NewCarPositionDto): Promise<string> {
        this.numberOfCarStopGauge.inc(1);
        await this.kafkaClient.emit(
            'car-stop',
            data
        );

        return "Stop sent"
    }

    public async sendAskRoute(data: AskRouteDto): Promise<string> {
        this.numberOfCarAskingRouteGauge.inc(1);
        await this.kafkaClient.emit(
            'ask-route',
            data
        );

        return "Stop sent"
    }

}
