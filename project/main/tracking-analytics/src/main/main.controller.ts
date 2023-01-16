import {Body, Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";
import {NewAnalyticsDto} from "./dto/new-analytics.dto";
import {PrometheusService} from "../prometheus/prometheus.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    private numberOfNewAnalyticsRequests = this.prometheusService.registerGauge("number_of_new_analytics_requests", "number_of_new_analytics_requests");

    constructor(private readonly appService: MainService, private prometheusService: PrometheusService ) { }

    @Get('')
    getHello(): string {
        return this.appService.getHello();
    }

    @Post('/new-analytics')
    public async newAnalytics(@Body() body: NewAnalyticsDto): Promise<any> {
        this.numberOfNewAnalyticsRequests.inc(1);
        return this.appService.newAnalytics(body);
    }
}
