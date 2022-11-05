import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import { AppService } from './app.service';
import {Bill} from "../schema/bill.schema";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public async getHello(): Promise<Bill[]> {
    return this.appService.getHello();
  }

  @Post('/new-bill')
  public async generateNewBill(@Body() body: {license_plate: string, bill: number}): Promise<Bill> {
    return await this.appService.generateNewBill(body.license_plate, body.bill);
  }

  @Put('/pay-bill/:idBill')
  public async payBill(@Param('idBill') idBill: string): Promise<Bill> {
    return await this.appService.payBill(idBill);
  }

  @Get('/user-bills/:license_plate')
  public async getUserBills(@Param('license_plate') licensePlate: string): Promise<Bill[]> {
    return await this.appService.getUserBills(licensePlate);
  }
}
