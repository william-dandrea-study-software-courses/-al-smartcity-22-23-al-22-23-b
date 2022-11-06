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
const car_position_schema_1 = require("./schema/car-position.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
let AppService = AppService_1 = class AppService {
    constructor(carPositionModel, httpService) {
        this.carPositionModel = carPositionModel;
        this.httpService = httpService;
        this.logger = new common_1.Logger(AppService_1.name);
    }
    getHello() {
        return this.carPositionModel.find({}).exec();
    }
    async onCarShutdownEvent(data) {
        const licensePlate = data.license_plate;
        const allCarPositions = await this.carPositionModel.find({ license_plate: licensePlate });
        if (allCarPositions) {
            let price = 0;
            allCarPositions.forEach(carPosition => {
                if (carPosition.zone === "1") {
                    price += 50;
                }
                else if (carPosition.zone === "2") {
                    price += 40;
                }
                else if (carPosition.zone === "3") {
                    price += 30;
                }
                else if (carPosition.zone === "4") {
                    price += 10;
                }
                else {
                    price += 5;
                }
            });
            this.httpService.post('http://billing-handler-dev:3000/new-bill', { 'license_plate': licensePlate, 'bill': price }).subscribe(async (response) => {
                await this.carPositionModel.deleteMany({ license_plate: licensePlate }).exec();
            }, error => {
                this.logger.error(`Cannot access to the service http://localhost:6803/new-bill with ${{ 'license_plate': licensePlate, 'bill': price }} => ${error}`);
            });
        }
        else {
            throw new common_1.HttpException("Cannot shutdown a car because the license_plate is not given", common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
};
AppService = AppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(car_position_schema_1.CarPosition.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        axios_1.HttpService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map