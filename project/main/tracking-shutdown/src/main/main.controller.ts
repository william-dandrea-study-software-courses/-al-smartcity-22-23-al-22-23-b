import {Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }

    @Get()
    getHello(): Promise<any> {
        return this.appService.getHello();
    }

    @EventPattern('real-car-shutdown')
    async handleCarShutdownEvent(data: Record<string, unknown>) {
        this.logger.log(data);
        await this.appService.onCarShutdownEvent(data)
    }
}
