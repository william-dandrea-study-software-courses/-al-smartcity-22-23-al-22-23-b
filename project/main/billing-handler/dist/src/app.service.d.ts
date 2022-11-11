import { Model } from "mongoose";
import { Bill, BillDocument } from "../schema/bill.schema";
export declare class AppService {
    private billModel;
    constructor(billModel: Model<BillDocument>);
    getHello(): Promise<Bill[]>;
    generateNewBill(license_plate: string, bill: number): Promise<Bill>;
    payBill(idBill: string): Promise<Bill>;
    getUserBills(licensePlate: string): Promise<Bill[]>;
}
