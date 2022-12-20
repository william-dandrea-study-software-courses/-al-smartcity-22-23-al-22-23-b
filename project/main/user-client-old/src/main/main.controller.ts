import {Body, Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }

    @Get('')
    getHello(): string {
        return this.appService.getHello();
    }
    @Post("/start-car")
    async startCar(@Body() body: {license_plate: string}) {
        return this.appService.startCar(body.license_plate);
    }

    @Post("/stop-car")
    async stopCar(@Body() body: {license_plate: string}) {
        return this.appService.stopCar(body.license_plate);
    }

    @Post("/edit-request-interval")
    async editRequestInterval(@Body() body: {license_plate: string, interval: number}) {
        return this.appService.editRequestInterval(body.license_plate, body.interval);
    }
}
