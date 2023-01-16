import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import {Model, Schema} from "mongoose";
import {Bill, Ticket, User, UserDocument} from './schema/user.schema';
import {PrometheusService} from "../prometheus/prometheus.service";
import { v4 as uuid } from 'uuid';

@Injectable()
export class MainService {

    private numberOfDatabaseCall = this.prometheusService.registerGauge("number_of_database_call", "number_of_database_call")
    private logger: Logger = new Logger(MainService.name)


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
        newBill._id = uuid()
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
        this.numberOfDatabaseCall.inc(2);

        const user: User = await this.userModel.findOne({ license_plate: licensePlate} );

        const index: number = user.bills.findIndex(b => b._id === idBill)
        if (index >= 0) {
            user.bills[index].is_paid = true
        }

        return this.userModel.updateOne({license_plate: licensePlate}, {"bills": user.bills});
    }

    public async payTicket(licensePlate: string, idTicket: string) {
        this.numberOfDatabaseCall.inc(2);

        const user: User = await this.userModel.findOne({ license_plate: licensePlate} );

        const index: number = user.tickets.findIndex(b => b._id === idTicket)
        if (index >= 0) {
            user.tickets[index].is_paid = true
        }

        return this.userModel.updateOne({license_plate: licensePlate}, {"tickets": user.tickets});

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
        newTicket._id = uuid();
        newTicket.price = price;
        newTicket.is_paid = false;
        newTicket.date = new Date();
        this.numberOfDatabaseCall.inc(1);
        return this.userModel.findOneAndUpdate({license_plate: licensePlate}, {$push: {tickets: newTicket}}, {returnDocument: 'after'});
    }
}
