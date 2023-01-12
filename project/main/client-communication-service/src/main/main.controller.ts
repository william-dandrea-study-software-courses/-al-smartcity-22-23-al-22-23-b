import {Body, Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";
import {NewFrequencyDto} from "./dto/new-frequency.dto";
import {RouteDto} from "./dto/route.dto";
import {PrometheusService} from "../prometheus/prometheus.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    private numberOfNewFrequenciesReceivedBySystem = this.prometheusService.registerGauge("number_of_new_frequencies_received_by_system", "number_of_new_frequencies_received_by_system");
    private numberOfNewRoutesReceivedBySystem = this.prometheusService.registerGauge("number_of_new_routes_received_by_system", "number_of_new_routes_received_by_system");

    constructor(private readonly appService: MainService, private prometheusService: PrometheusService) { }

    @Post('new-frequency')
    public async postNewFrequency(@Body() body: NewFrequencyDto) {
        this.numberOfNewFrequenciesReceivedBySystem.inc(1);
        this.logger.log(`New frequency received for car ${body.license_plate}`)
        await this.appService.newCarFrequency(body);
    }

    @Post('route')
    public async sendRoutes(@Body() body: RouteDto) {
        this.numberOfNewRoutesReceivedBySystem.inc(1);
        this.logger.log(`New route available for car ${body.license_plate}`)
        await this.appService.sendRoute(body);
    }

    @Get('')
    async getHello(): Promise<any> {
        return this.appService.getHello();
    }
}
