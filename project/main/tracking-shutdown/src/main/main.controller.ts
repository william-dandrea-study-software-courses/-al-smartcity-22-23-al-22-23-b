import {Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";
import {PrometheusService} from "../prometheus/prometheus.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    private numberOfCarShutdownEventReceived = this.prometheusService.registerGauge("number_of_car_shutdown_events_received", "number_of_car_shutdown_events_received")

    constructor(private readonly appService: MainService, private prometheusService: PrometheusService) { }

    @Get()
    getHello(): Promise<any> {
        return this.appService.getHello();
    }


    @EventPattern('real-car-shutdown')
    async handleCarShutdownEvent(data: Record<string, unknown>) {
        this.numberOfCarShutdownEventReceived.inc(1);
        this.logger.log(`New car shutdown ${data}`);
        await this.appService.onCarShutdownEvent(data)
    }
}
