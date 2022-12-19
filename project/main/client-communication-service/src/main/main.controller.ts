import {Body, Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";
import {NewFrequencyDto} from "./dto/new-frequency.dto";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }

    @Post('new-frequency')
    public async postNewFrequency(@Body() body: NewFrequencyDto) {
        this.logger.log("Bonjout")
        await this.appService.newCarFrequency(body);
    }

    @Get('')
    getHello(): string {
        return this.appService.getHello();
    }
}
