import { Controller, Get, Logger, Post, Param } from '@nestjs/common';
import { EventPattern } from "@nestjs/microservices";
import { MainService } from "./main.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }

    @Get('/check')
    checkCamera(): boolean {
        return this.appService.checkCamera();
    }
}
