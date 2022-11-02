import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { CarPosition, CarPositionDocument } from './schema/car-position.schema';
export declare class AppService {
    private carPositionModel;
    private readonly httpService;
    constructor(carPositionModel: Model<CarPositionDocument>, httpService: HttpService);
    addPosition(license_plate: string, zone: string, time: string): Promise<CarPosition>;
    getZonePollution(lon: number, lat: number): Promise<string>;
    getHello(): string;
}
