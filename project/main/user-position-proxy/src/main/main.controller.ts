import { Controller, Get, Logger, Post, Query, Body } from '@nestjs/common';
import { EventPattern } from "@nestjs/microservices";
import { NewCarPositionDto } from './dto/new-car-position.dto';
import { MainService } from "./main.service";
import { CarPosition } from './schema/car-position.schema';
import {PrometheusHistogram, PrometheusService} from "../prometheus/prometheus.service";
import {AskRouteDto} from "./dto/ask-route.dto";
// import { CarPosition } from './schema/car-position.schema';

import { Gauge } from "prom-client";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    private gauge = this.prometheusService.registerGauge("number_of_input_request", "Total number of input requests")

    constructor(private readonly appService: MainService, private prometheusService: PrometheusService) {}

    @Get('')
    async getHello(): Promise<string> {
        return await this.appService.getHello();
    }

    @Post('/position-tracking')
    public async sendPositionCar(@Body() carPosition: NewCarPositionDto): Promise<string> {
        this.gauge.inc(1);
        this.logger.log(`Car ${carPosition.license_plate} send a new position (LonLat: ${carPosition.location.lon},${carPosition.location.lat})`);
        return await this.appService.sendPosition(carPosition);
    }

    @Post('/start')
    public async sendStartCar(@Body() carPosition: NewCarPositionDto): Promise<string> {
        this.gauge.inc(1);
        this.logger.log(`Car ${carPosition.license_plate} start driving (LonLat: ${carPosition.location.lon},${carPosition.location.lat})`);
        return await this.appService.sendStart(carPosition);
    }

    @Post('/stop')
    public async sendStopCar(@Body() carPosition: NewCarPositionDto): Promise<string> {
        this.gauge.inc(1);
        this.logger.log(`Car ${carPosition.license_plate} stop driving (LonLat: ${carPosition.location.lon},${carPosition.location.lat})`);
        return await this.appService.sendStop(carPosition);
    }

    @Post('/ask-route')
    public async sendAskRoute(@Body() askRoute : AskRouteDto): Promise<string>{
        this.gauge.inc(1);
        return await this.appService.sendAskRoute(askRoute);
    }

}
