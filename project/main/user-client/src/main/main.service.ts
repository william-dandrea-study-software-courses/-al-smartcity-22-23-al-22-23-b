import {CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {Cache} from "cache-manager";
import {SchedulerRegistry} from "@nestjs/schedule";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);
    public INITIAL_INTERVAL_CAR_POSITION: number = 1 // seconds

    constructor(
        @Inject('RABBITMQ_SERVICE_CAR_TRACKER_QUEUE') private carTrackerClient: ClientProxy,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private schedulerRegistry: SchedulerRegistry,
    ) { }

    public get isConnected(): boolean {
        return true;
    }


    async startCar(licencePlate: string) {
        const currentInterval = this.schedulerRegistry.doesExist('interval', licencePlate);
        if (!currentInterval) {
            await this.addInterval(licencePlate, this.INITIAL_INTERVAL_CAR_POSITION);
            return { status: 200, message: 'Car created with success' };
        }
        throw new HttpException(`Cannot find the car with the licence plate ${licencePlate}`, HttpStatus.UNPROCESSABLE_ENTITY)
    }


    async stopCar(licencePlate: string) {
        const currentInterval = this.schedulerRegistry.doesExist('interval', licencePlate);
        if (currentInterval) {
            await this.deleteInterval(licencePlate);
            return { status: 200, message: 'Car deleted with success' };
        }
        throw new HttpException(`Cannot find the car with the licence plate ${licencePlate}`, HttpStatus.UNPROCESSABLE_ENTITY)
    }

    async editRequestInterval(licencePlate: string, interval: number) {
        const currentInterval = this.schedulerRegistry.doesExist('interval', licencePlate);
        if (currentInterval) {
            await this.setIntervalCar(licencePlate, interval);
            return { status: 200, message: 'Car interval setted with success' };
        }
        throw new HttpException(`Cannot find the car with the licence plate ${licencePlate}`, HttpStatus.UNPROCESSABLE_ENTITY)
    }

    async addInterval(licensePlate: string, seconds: number) {
        const milliseconds: number = seconds * 1000;
        const interval = setInterval(() => this.sendCarPosition(licensePlate, seconds), milliseconds);
        this.schedulerRegistry.addInterval(licensePlate, interval);
    }

    async deleteInterval(licensePlate: string) {
        await this.schedulerRegistry.deleteInterval(licensePlate);
        await this.sendCarShutdown(licensePlate)
        this.logger.warn(`Car ${licensePlate} stopped!`);
    }

    async setIntervalCar(licensePlate: string, newInterval: number) {
        await this.schedulerRegistry.deleteInterval(licensePlate);
        await this.addInterval(licensePlate, newInterval)
    }

    async sendCarPosition(licencePlate: string, milliseconds: number) {
        const newLat: number = Math.random() * 10;
        const newLon: number = Math.random() * 10;

        this.carTrackerClient.emit(
            'car-position',
            {
                location: {
                    lon: newLon,
                    lat: newLat
                },
                license_plate: licencePlate,
                time: (new Date()).toISOString()
            }
        );
        this.logger.log(`Car ${licencePlate} send request every ${milliseconds}`);
    }

    async sendCarShutdown(licensePlate: string) {
        const newLat: number = Math.random() * 10;
        const newLon: number = Math.random() * 10;

        await this.carTrackerClient.emit(
            'car-shutdown',
            {
                location: {
                    lon: newLon,
                    lat: newLat
                },
                license_plate: licensePlate,
                time: (new Date()).toISOString()
            }
        );

        this.logger.log(`Car ${licensePlate} send CAR_SHUTDOWN`);
    }

    getHello() {
        return "Hello Workd"
    }


    /*

        async getHello(){
            return this.carTrackerClient.send(
                {cmd: 'greeting'},
                'Progressive Coder'
            );
        }


        async getHelloAsync() {
          const message = await this.carTrackerClient.send(
              {cmd: 'greeting-async'},
              'Progressive Coder'
          );
          return message;
        }

        async publishEvent() {
          this.carTrackerClient.emit(
              'book-created',
              {'bookName': 'The Way Of Kings', 'author': 'Brandon Sanderson'}
          );
        }*/


}
