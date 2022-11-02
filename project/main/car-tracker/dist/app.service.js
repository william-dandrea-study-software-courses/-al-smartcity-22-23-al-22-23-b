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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const car_position_schema_1 = require("./schema/car-position.schema");
let AppService = class AppService {
    constructor(carPositionModel, httpService) {
        this.carPositionModel = carPositionModel;
        this.httpService = httpService;
    }
    addPosition(license_plate, zone, time) {
        const position = new this.carPositionModel({
            "license_plate": license_plate,
            "zone": zone,
            "time": time,
        });
        return position.save();
    }
    async getZonePollution(lon, lat) {
        return await this.httpService.axiosRef.get('http://mock-pollution-zones-emitter-dev:3000/zone?lon=' + lon + "&lat=" + lat).then((response) => {
            return response.data;
        }).catch((error) => {
            console.log(error);
        });
    }
    getHello() {
        return 'Hello World!';
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(car_position_schema_1.CarPosition.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, axios_1.HttpService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map