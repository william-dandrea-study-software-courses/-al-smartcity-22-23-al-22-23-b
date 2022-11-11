import { AppService } from './app.service';
import { Bill } from "../schema/bill.schema";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): Promise<Bill[]>;
    generateNewBill(body: {
        license_plate: string;
        bill: number;
    }): Promise<Bill>;
    payBill(idBill: string): Promise<Bill>;
    getUserBills(licensePlate: string): Promise<Bill[]>;
}
