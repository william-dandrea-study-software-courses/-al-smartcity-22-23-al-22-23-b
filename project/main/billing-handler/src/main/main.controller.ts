import { Body, Controller, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { MainService } from "./main.service";
import { Bill } from "./schema/bill.schema";
import { Ticket } from './schema/ticket.schema';
import { User } from './schema/user.schema';

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    constructor(private readonly appService: MainService) { }


    @Post('/new-bill')
    public async generateNewBill(@Body() body: { license_plate: string, bill: number }) {
        this.logger.log("New Bill");
        return await this.appService.generateNewBill(body.license_plate, body.bill);
    }


    @Put('/pay-bill/:license_plate')
    public async payBill(@Param('license_plate') licensePlate: string, @Body() body: { idBill: string }) {
        this.logger.log("Pay Bill");
        return await this.appService.payBill(licensePlate, body.idBill);
    }

    @Put('/pay-ticket/:license_plate')
    public async payTicket(@Param('license_plate') licensePlate: string, @Body() body: { idTicket: string }) {
        this.logger.log("Pay Ticket");
        return await this.appService.payTicket(licensePlate, body.idTicket);
    }

    @Get('/user-bills/:license_plate')
    public async getUserBills(@Param('license_plate') licensePlate: string): Promise<User> {
        this.logger.log("Get all user bills");
        return await this.appService.getUserBills(licensePlate);
    }

    @Post('/add-ticket/:license_plate')
    public async addTicket(@Param('license_plate') licensePlate: string, @Body() body: { price: number }) {
        this.logger.log("Add ticket");
        return await this.appService.generateNewTicket(licensePlate, body.price);
    }
}
