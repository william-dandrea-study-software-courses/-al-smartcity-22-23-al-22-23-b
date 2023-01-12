import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Bill, BillDocument } from "./schema/bill.schema";
import { Ticket } from './schema/ticket.schema';
import { User, UserDocument } from './schema/user.schema';
import {PrometheusService} from "../prometheus/prometheus.service";

@Injectable()
export class MainService {

    private numberOfDatabaseCall = this.prometheusService.registerGauge("number_of_database_call", "number_of_database_call")


    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private prometheusService: PrometheusService) { }

    public get isConnected(): boolean {
        return true;
    }

    public async getHello(): Promise<User[]> {
        return await this.userModel.find({}).exec();
    }


    public async generateNewBill(licensePlate: string, bill: number) {
        if (await this.userModel.find({ license_plate: licensePlate }).count() == 0) {
            this.numberOfDatabaseCall.inc(1);
            await this.newUser(licensePlate);
        }


        const newBill: Bill = new Bill();
        newBill.price = bill;
        newBill.is_paid = false;
        newBill.date = new Date();
        this.numberOfDatabaseCall.inc(1);
        return await this.userModel.findOneAndUpdate({ license_plate: licensePlate }, { $push: { bills: newBill } }, { returnDocument: 'after' });
    }

    public async newUser(licensePlate: string): Promise<User> {
        const newUser: User = new User();
        newUser.license_plate = licensePlate;
        newUser.bills = [];
        newUser.tickets = [];
        this.numberOfDatabaseCall.inc(1);
        return await this.userModel.create(newUser);
    }

    public async payBill(licensePlate: string, idBill: string) {
        this.numberOfDatabaseCall.inc(1);
        return await this.userModel.find({ license_plate: licensePlate, 'bills._id': idBill }).updateOne({ 'bills.$.is_paid': true }, { returnDocument: 'after' });
    }

    public async payTicket(licensePlate: string, idTicket: string) {
        this.numberOfDatabaseCall.inc(1);
        return await this.userModel.find({ licensePlate: licensePlate, 'tickets._id': idTicket }).updateOne({ 'tickets.$.is_paid': true }, { returnDocument: 'after' });
    }

    public async getUserBills(licensePlate: string): Promise<User> {
        this.numberOfDatabaseCall.inc(1);
        return this.userModel.findOne({ license_plate: licensePlate }).exec();
    }

    public async generateNewTicket(licensePlate: string, price: number) {
        if (await this.userModel.find({ license_plate: licensePlate }).count() == 0) {
            this.numberOfDatabaseCall.inc(1);
            await this.newUser(licensePlate);
        }


        const newTicket: Ticket = new Ticket();
        newTicket.price = price;
        newTicket.is_paid = false;
        newTicket.date = new Date();
        this.numberOfDatabaseCall.inc(1);
        return this.userModel.findOneAndUpdate({license_plate: licensePlate}, {$push: {tickets: newTicket}}, {returnDocument: 'after'});
    }
}
