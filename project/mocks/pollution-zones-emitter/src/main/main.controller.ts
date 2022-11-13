import {Controller, Get, Logger, Post, Query} from '@nestjs/common';
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

    @Get("/zone")
    async getZone(@Query() lon: number, @Query() lat: number): Promise<string> {
        return "1";
    }
}
