import {Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }

    @EventPattern('position_pattern')
    public receiveNewPosition(data: any) {
        console.log(data);

    }

    @Get('')
    getHello(): string {
        return this.appService.getHello();
    }
}
