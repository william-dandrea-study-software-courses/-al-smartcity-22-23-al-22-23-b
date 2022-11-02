import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { CarPosition, CarPositionDocument } from './schema/car-position.schema';
import { ClientProxy } from '@nestjs/microservices';
export declare class AppService {
    private carPositionModel;
    private readonly httpService;
    private client;
    private readonly logger;
    constructor(carPositionModel: Model<CarPositionDocument>, httpService: HttpService, client: ClientProxy);
    addPosition(license_plate: string, zone: string, time: string): Promise<CarPosition>;
    getZonePollution(lon: number, lat: number): Promise<string>;
    sendRealCarShutdown(licensePlate: string): Promise<void>;
    getHello(): string;
}
