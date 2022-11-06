import { Injectable } from '@nestjs/common';
import {Model} from "mongoose";
import {Bill, BillDocument} from "../schema/bill.schema";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class AppService {
  constructor(@InjectModel(Bill.name) private billModel: Model<BillDocument>,) {
  }

  public async getHello(): Promise<Bill[]> {
    return await this.billModel.find({}).exec();
  }

  public async generateNewBill(license_plate: string, bill: number): Promise<Bill> {
    const newBill: Bill = new Bill();
    newBill.license_plate = license_plate;
    newBill.price = bill;
    newBill.is_paid = false;
    return await this.billModel.create(newBill)
  }

  public async payBill(idBill: string): Promise<Bill> {
    return this.billModel.findByIdAndUpdate(idBill, {is_paid: true}, { returnDocument: 'after' });
  }

  async getUserBills(licensePlate: string): Promise<Bill[]> {
    return this.billModel.find({license_plate: licensePlate}).exec();
  }
}
