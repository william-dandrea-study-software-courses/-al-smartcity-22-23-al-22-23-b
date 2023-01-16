import {Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";
import {AskRouteDto} from "./dto/ask-route.dto";
import * as http from "http";
import {PrometheusService} from "../prometheus/prometheus.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);
    private numberOfAskedRoutes = this.prometheusService.registerGauge("number_of_asked_routes_events", "number_of_asked_routes_events");

    constructor(private readonly appService: MainService, private prometheusService: PrometheusService) { }


    @EventPattern('ask-route')
    public async receiveAskRoute(askRoute: AskRouteDto) {
        this.numberOfAskedRoutes.inc(1);
        await this.appService.getFullRouteAndSendIt(askRoute)
    }
}
