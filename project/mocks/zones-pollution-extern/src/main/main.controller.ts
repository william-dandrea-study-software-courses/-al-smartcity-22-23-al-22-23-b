import { Controller, Get, Logger } from '@nestjs/common';
import { MainService } from "./main.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);



    constructor(private readonly appService: MainService) { }

    @Get("/zones")
    getZones() {
        return this.appService.getZones();
    }

}
