import {Body, Controller, Get, Logger, Param, Post, Put} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {MainService} from "./main.service";
import {Bill} from "./schema/bill.schema";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) {}

    @Get()
    public async getHello(): Promise<Bill[]> {
        return this.appService.getHello();
    }


    @Post('/new-bill')
    public async generateNewBill(@Body() body: {license_plate: string, bill: number}): Promise<Bill> {
        this.logger.log("New Bill")
        return await this.appService.generateNewBill(body.license_plate, body.bill);
    }


    @Put('/pay-bill/:idBill')
    public async payBill(@Param('idBill') idBill: string): Promise<Bill> {
        this.logger.log("Pay Bill")
        return await this.appService.payBill(idBill);
    }

    @Get('/user-bills/:license_plate')
    public async getUserBills(@Param('license_plate') licensePlate: string): Promise<Bill[]> {
        this.logger.log("Get all user bills")
        return await this.appService.getUserBills(licensePlate);
    }
}
