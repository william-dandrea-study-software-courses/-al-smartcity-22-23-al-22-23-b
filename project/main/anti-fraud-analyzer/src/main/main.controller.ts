import { Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { EventPattern } from "@nestjs/microservices";
import { MainService } from "./main.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }

    @EventPattern('car-position')
    public async receiveNewPosition(data: any) {
        this.logger.log('car-position ', data);
        this.appService.checkCamera(data.license_plate);
    }

    @EventPattern('car-start')
    public async receiveStart(data: any) {
        this.logger.log('car-start ', data)
        if (this.appService.isFraudulent(data.license_plate, data.location)) {
            this.appService.sendTicket(data.license_plate);
        }
    }

    @EventPattern('car-stop')
    public async receiveStop(data: any) {
        this.logger.log('car-stop ', data);
        this.appService.updateStop(data.license_plate, data.location);
    }

}
