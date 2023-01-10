import { Controller, Get, Logger, Post, Query, Body } from '@nestjs/common';
import { EventPattern } from "@nestjs/microservices";
import { NewCarPositionDto } from './dto/new-car-position.dto';
import { MainService } from "./main.service";
import { CarPosition } from './schema/car-position.schema';
import {AskRouteDto} from "./dto/ask-route.dto";
// import { CarPosition } from './schema/car-position.schema';

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }

    @Get('')
    async getHello(): Promise<string> {
        return await this.appService.getHello();
    }

    @Post('/position-tracking')
    public async sendPositionCar(@Body() CarPosition: NewCarPositionDto): Promise<string> {
        return await this.appService.sendPosition(CarPosition);
    }

    @Post('/start')
    public async sendStartCar(@Body() carPosition: NewCarPositionDto): Promise<string> {
        return await this.appService.sendStart(carPosition);
    }

    @Post('/stop')
    public async sendStopCar(@Body() CarPosition: NewCarPositionDto): Promise<string> {
        return await this.appService.sendStop(CarPosition);
    }

    @Post('/ask-route')
    public async sendAskRoute(@Body() askRoute : AskRouteDto): Promise<string>{
        return await this.appService.sendAskRoute(askRoute);
    }

}
