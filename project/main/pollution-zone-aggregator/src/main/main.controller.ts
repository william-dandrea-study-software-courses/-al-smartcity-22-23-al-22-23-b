import {Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }

    @Post("zone")
    getZone(@Query() query: {long: number,  lat: number}) {
        return this.appService.getHello(query.long, query.lat)
    }
}
