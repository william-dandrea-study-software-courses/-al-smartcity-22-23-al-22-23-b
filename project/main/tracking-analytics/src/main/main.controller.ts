import {Body, Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";
import {NewAnalyticsDto} from "./dto/new-analytics.dto";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }

    @Get('')
    getHello(): string {
        return this.appService.getHello();
    }

    @Post('/new-analytics')
    public async newAnalytics(@Body() body: NewAnalyticsDto): Promise<any> {
        return this.appService.newAnalytics(body);
    }
}
