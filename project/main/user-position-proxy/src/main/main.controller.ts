import { Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { EventPattern } from "@nestjs/microservices";
import { MainService } from "./main.service";
import { CarPosition } from './schema/car-position.schema';

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }

    @Get('')
    async getHello(): Promise<string> {
        return await this.appService.getHello();
    }

    @Get('/position')
    async sendPosition(): Promise<string> {
        let mockData: CarPosition = {
            "license_plate": "AA-123-AA",
            "location": {
                "lon": 2.345,
                "lat": 48.856
            },
            "time": (new Date()).toISOString()
        }
        return await this.appService.sendPosition(mockData);
    }

    @Get('/start')
    async sendStart(): Promise<string> {
        let mockData: CarPosition = {
            "license_plate": "AA-123-AA",
            "location": {
                "lon": 2.345,
                "lat": 48.856
            },
            "time": (new Date()).toISOString()
        }
        return await this.appService.sendStart(mockData);
    }

    @Get('/stop')
    async sendStop(): Promise<string> {
        let mockData: CarPosition = {
            "license_plate": "AA-123-AA",
            "location": {
                "lon": 2.345,
                "lat": 48.856
            },
            "time": (new Date()).toISOString()
        }
        return await this.appService.sendStop(mockData);
    }


}
