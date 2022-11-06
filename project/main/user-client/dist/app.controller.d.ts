import { AppService } from "./app.service";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    private readonly logger;
    startCar(body: {
        license_plate: string;
    }): Promise<unknown>;
    stopCar(body: {
        license_plate: string;
    }): Promise<unknown>;
    editRequestInterval(body: {
        license_plate: string;
        interval: number;
    }): Promise<unknown>;
}
