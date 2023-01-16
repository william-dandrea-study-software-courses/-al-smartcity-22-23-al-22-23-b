import { Body, Controller, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { MainService } from "./main.service";
import { User } from './schema/user.schema';
import {PrometheusService} from "../prometheus/prometheus.service";

@Controller('')
export class MainController {
    private readonly logger = new Logger(MainController.name);

    private numberOfInputRequests = this.prometheusService.registerGauge("number_of_input_request", "number_of_input_request");
    private numberOfSystemInputRequests = this.prometheusService.registerGauge("number_of_system_input_request", "number_of_system_input_request");
    private numberOfUserInputRequests = this.prometheusService.registerGauge("number_of_user_input_request", "number_of_user_input_request");

    private serviceUp = this.prometheusService.registerGauge("service_up", "service_up")
    // this.serviceUp.set(1);

    constructor(private readonly appService: MainService, private prometheusService: PrometheusService) {
        this.serviceUp.set(1);
    }


    @Post('/new-bill')
    public async generateNewBill(@Body() body: { license_plate: string, bill: number }) {
        this.numberOfInputRequests.inc(1);
        this.numberOfSystemInputRequests.inc(1);
        this.logger.log("New Bill");
        return await this.appService.generateNewBill(body.license_plate, body.bill);
    }


    @Put('/pay-bill/:license_plate')
    public async payBill(@Param('license_plate') licensePlate: string, @Body() body: { idBill: string }) {
        this.numberOfInputRequests.inc(1);
        this.numberOfUserInputRequests.inc(1);
        this.logger.log("Pay Bill");
        return await this.appService.payBill(licensePlate, body.idBill);
    }

    @Put('/pay-ticket/:license_plate')
    public async payTicket(@Param('license_plate') licensePlate: string, @Body() body: { idTicket: string }) {
        this.numberOfInputRequests.inc(1);
        this.numberOfUserInputRequests.inc(1);
        this.logger.log("Pay Ticket");
        return await this.appService.payTicket(licensePlate, body.idTicket);
    }

    @Get('/user-bills/:license_plate')
    public async getUserBills(@Param('license_plate') licensePlate: string): Promise<User> {
        this.numberOfInputRequests.inc(1);
        this.numberOfUserInputRequests.inc(1);
        this.logger.log("Get all user bills");
        return await this.appService.getUserBills(licensePlate);
    }

    @Post('/add-ticket/:license_plate')
    public async addTicket(@Param('license_plate') licensePlate: string, @Body() body: { price: number }) {
        this.numberOfInputRequests.inc(1);
        this.numberOfSystemInputRequests.inc(1);
        this.logger.log("Add ticket");
        return await this.appService.generateNewTicket(licensePlate, body.price);
    }
}
