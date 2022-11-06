import { BadRequestException, CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { SchedulerRegistry } from "@nestjs/schedule";

@Injectable()
export class AppService {

    private readonly logger = new Logger(AppService.name);
    public INITIAL_INTERVAL_CAR_POSITION: number = 1 // seconds

    constructor(
        @Inject('RABBITMQ_SERVICE_CAR_TRACKER_QUEUE') private carTrackerClient: ClientProxy,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private schedulerRegistry: SchedulerRegistry,
    ) { }

    async startCar(licencePlate: string) {
        return new Promise(async (resolve, reject) => {
            await this.addInterval(licencePlate, this.INITIAL_INTERVAL_CAR_POSITION);
            resolve({ status: 200, message: 'Car created with success' });
        });
    }


    async stopCar(licencePlate: string) {
        return new Promise(async (resolve, reject) => {
            await this.deleteInterval(licencePlate);
            resolve({ status: 200, message: 'Car deleted with success' });
        });
    }

    async editRequestInterval(licencePlate: string, interval: number) {
        return new Promise(async (resolve, reject) => {
            await this.setIntervalCar(licencePlate, interval);
            resolve({ status: 200, message: 'Car updated with success' });
        });
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
        await this.deleteInterval(licensePlate);
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
