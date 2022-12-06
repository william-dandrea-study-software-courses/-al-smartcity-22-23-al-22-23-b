import {Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }


    @Post("zone")
    getZone(@Query() query: {long: number,  lat: number}) {
        return this.appService.getZone(query.long, query.lat)
    }


    @EventPattern('car-shutdown')
    async handleCarShutdown(data: Record<string, string>) {
        this.logger.log('car-shutdown ', data)
        const zone = await this.appService.getZonePollution(data.location['lon'], data.location['lat']);
        await this.appService.addPosition(data.license_plate, zone, data.time);
        await this.appService.sendRealCarShutdown(data.license_plate);
    }

    @EventPattern('car-position')
    async handleCarPosition(data: Record<string, string>) {
        this.logger.log('car-position ', data)
        const zone = await this.appService.getZonePollution(data.location['lon'], data.location['lat']);
        this.appService.addPosition(data.license_plate, zone, data.time);
    }




}
