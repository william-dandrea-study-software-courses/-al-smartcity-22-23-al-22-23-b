import {Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";
import {CarPositionSchema} from "./models/car-position.schema";
import {PrometheusService} from "../prometheus/prometheus.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    private numberOfCarStartGauge = this.prometheusService.registerGauge("number_of_car_start_input_events", "number_of_car_start_input_events")
    private numberOfCarPositionGauge = this.prometheusService.registerGauge("number_of_car_position_input_events", "number_of_car_position_input_events")

    constructor(private readonly appService: MainService, private prometheusService: PrometheusService) { }

    @EventPattern('car-position-optimisation-and-fraud-topic')
    public async receiveNewPosition(data: CarPositionSchema) {
        this.numberOfCarStartGauge.inc(1);
        this.logger.log('car-position ', data);
        await this.appService.newPosition(data);
    }

    @EventPattern('car-start')
    public async receiveStart(data: CarPositionSchema) {
        this.numberOfCarPositionGauge.inc(1);
        this.logger.log('car-start ', data)
        await this.appService.newPosition(data);
    }


    /*
    @Get('')
    getHello() {
        return this.appService.getZone();
    }*/
}
