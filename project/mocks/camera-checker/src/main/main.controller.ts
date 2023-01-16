import { Controller, Get, Logger, Post, Param } from '@nestjs/common';
import { EventPattern } from "@nestjs/microservices";
import { PrometheusService } from 'src/prometheus/prometheus.service';
import { MainService } from "./main.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    private numberOfCameraCheckRequests = this.prometheusService.registerGauge("number_of_camera_checks_requests", "number_of_camera_checks_requests")

    private serviceUp = this.prometheusService.registerGauge("service_up", "service_up")
    // this.serviceUp.set(1);

    constructor(private readonly appService: MainService, private prometheusService: PrometheusService) {
        this.serviceUp.set(1);
    }

    @Get('/check')
    checkCamera(): boolean {
        this.numberOfCameraCheckRequests.inc(1);
        return this.appService.checkCamera();
    }
}
