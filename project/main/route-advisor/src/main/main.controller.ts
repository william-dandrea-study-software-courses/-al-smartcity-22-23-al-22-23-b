import {Controller, Get, Logger, Post, Query} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";
import {AskRouteDto} from "./dto/ask-route.dto";
import * as http from "http";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }


    @EventPattern('ask-route')
    public async receiveAskRoute(askRoute: AskRouteDto) {
        await this.appService.getFullRouteAndSendIt(askRoute)}
}
