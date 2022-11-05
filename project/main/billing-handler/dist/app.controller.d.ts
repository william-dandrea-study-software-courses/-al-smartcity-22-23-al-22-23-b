import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    generateNewBill(body: {
        license_plate: string;
        bill: number;
    }): Promise<any>;
}
