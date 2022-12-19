import {Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";
import {CarPositionSchema} from "./models/car-position.schema";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }

    @EventPattern('car-position')
    public async receiveNewPosition(data: CarPositionSchema) {
        this.logger.log('car-position ', data);
        await this.appService.newPosition(data);
    }

    @EventPattern('car-start')
    public async receiveStart(data: CarPositionSchema) {
        this.logger.log('car-start ', data)
        await this.appService.newPosition(data);
    }

    /*
    @Get('')
    getHello() {
        return this.appService.getZone();
    }*/
}
