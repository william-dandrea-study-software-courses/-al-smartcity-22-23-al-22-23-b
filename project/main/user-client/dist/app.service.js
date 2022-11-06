"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const schedule_1 = require("@nestjs/schedule");
let AppService = AppService_1 = class AppService {
    constructor(carTrackerClient, cacheManager, schedulerRegistry) {
        this.carTrackerClient = carTrackerClient;
        this.cacheManager = cacheManager;
        this.schedulerRegistry = schedulerRegistry;
        this.logger = new common_1.Logger(AppService_1.name);
        this.INITIAL_INTERVAL_CAR_POSITION = 1;
    }
    async startCar(licencePlate) {
        return new Promise(async (resolve, reject) => {
            await this.addInterval(licencePlate, this.INITIAL_INTERVAL_CAR_POSITION);
            resolve({ status: 200, message: 'Car created with success' });
        });
    }
    async stopCar(licencePlate) {
        return new Promise(async (resolve, reject) => {
            await this.deleteInterval(licencePlate);
            resolve({ status: 200, message: 'Car deleted with success' });
        });
    }
    async editRequestInterval(licencePlate, interval) {
        return new Promise(async (resolve, reject) => {
            await this.setIntervalCar(licencePlate, interval);
            resolve({ status: 200, message: 'Car updated with success' });
        });
    }
    async addInterval(licensePlate, seconds) {
        const milliseconds = seconds * 1000;
        const interval = setInterval(() => this.sendCarPosition(licensePlate, seconds), milliseconds);
        this.schedulerRegistry.addInterval(licensePlate, interval);
    }
    async deleteInterval(licensePlate) {
        await this.schedulerRegistry.deleteInterval(licensePlate);
        await this.sendCarShutdown(licensePlate);
        this.logger.warn(`Car ${licensePlate} stopped!`);
    }
    async setIntervalCar(licensePlate, newInterval) {
        await this.deleteInterval(licensePlate);
        await this.addInterval(licensePlate, newInterval);
    }
    async sendCarPosition(licencePlate, milliseconds) {
        const newLat = Math.random() * 10;
        const newLon = Math.random() * 10;
        this.carTrackerClient.emit('car-position', {
            location: {
                lon: newLon,
                lat: newLat
            },
            license_plate: licencePlate,
            time: (new Date()).toISOString()
        });
        this.logger.log(`Car ${licencePlate} send request every ${milliseconds}`);
    }
    async sendCarShutdown(licensePlate) {
        const newLat = Math.random() * 10;
        const newLon = Math.random() * 10;
        await this.carTrackerClient.emit('car-shutdown', {
            location: {
                lon: newLon,
                lat: newLat
            },
            license_plate: licensePlate,
            time: (new Date()).toISOString()
        });
        this.logger.log(`Car ${licensePlate} send CAR_SHUTDOWN`);
    }
};
AppService = AppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RABBITMQ_SERVICE_CAR_TRACKER_QUEUE')),
    __param(1, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [microservices_1.ClientProxy, Object, schedule_1.SchedulerRegistry])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map