import { CarPositionDocument } from "./schema/car-position.schema";
import { Model } from "mongoose";
import { HttpService } from "@nestjs/axios";
export declare class AppService {
    private carPositionModel;
    private readonly httpService;
    private readonly logger;
    constructor(carPositionModel: Model<CarPositionDocument>, httpService: HttpService);
    getHello(): Promise<any>;
    onCarShutdownEvent(data: Record<string, unknown>): Promise<void>;
}
