import { ClientProxy } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { SchedulerRegistry } from "@nestjs/schedule";
export declare class AppService {
    private carTrackerClient;
    private cacheManager;
    private schedulerRegistry;
    private readonly logger;
    INITIAL_INTERVAL_CAR_POSITION: number;
    constructor(carTrackerClient: ClientProxy, cacheManager: Cache, schedulerRegistry: SchedulerRegistry);
    startCar(licencePlate: string): Promise<unknown>;
    stopCar(licencePlate: string): Promise<unknown>;
    editRequestInterval(licencePlate: string, interval: number): Promise<unknown>;
    addInterval(licensePlate: string, seconds: number): Promise<void>;
    deleteInterval(licensePlate: string): Promise<void>;
    setIntervalCar(licensePlate: string, newInterval: number): Promise<void>;
    sendCarPosition(licencePlate: string, milliseconds: number): Promise<void>;
    sendCarShutdown(licensePlate: string): Promise<void>;
}
