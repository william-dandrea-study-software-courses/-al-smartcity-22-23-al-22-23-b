import { Controller, Get, Logger, Query } from '@nestjs/common';
import { EventPattern } from "@nestjs/microservices";
import { MainService } from "./main.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }

    @EventPattern('car-position')
    public async receiveNewPosition(data: any) {
        this.logger.log('car-position ', data)
        await this.appService.addPosition(data.license_plate, data.location['lon'], data.location['lat'], data.time);
    }

    @EventPattern('car-start')
    public async receiveStart(data: any) {
        this.logger.log('car-start ', data)
        this.appService.addPosition(data.license_plate, data.location['lon'], data.location['lat'], data.time);
    }

    @EventPattern('car-stop')
    public async receiveStop(data: any) {
        this.logger.log('car-stop ', data)
        await this.appService.addPosition(data.license_plate, data.location['lon'], data.location['lat'], data.time);
        await this.appService.sendRealCarShutdown(data.license_plate);
    }

}
