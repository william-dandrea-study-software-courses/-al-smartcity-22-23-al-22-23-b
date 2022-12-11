import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectModel } from "@nestjs/mongoose";
import { CarPosition, CarPositionDocument } from "./schema/car-position.schema";
import { Model } from "mongoose";
import { HttpService } from "@nestjs/axios";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";
import { PollutionZone } from "./schema/pollution-zone.schema";

@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    constructor(
        @InjectModel(CarPosition.name) private carPositionModel: Model<CarPositionDocument>,
        private readonly httpService: HttpService,
        @Inject('RABBITMQ_SERVICE_TRACKING_SHUTDOWN') private trackingShutdownClient: ClientProxy,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        this.pullZones();
    }

    pullZones() {
        this.httpService.axiosRef.get('http://zones-pollution-extern:3000/zones').then((response) => {
            this.cacheManager.set('zones', response.data, 0);
            response.data.forEach((zone: PollutionZone) => {
                this.logger.log(`zone-${zone.number} pulled and saved in cache`);
            });
        }).catch((error) => {
            this.logger.error(error);
        });
    }

    receiveNewPosition(data: any) {
        console.log(data);
    }

    addPosition(license_plate: string, long: number, lat: number, time: string): Promise<CarPosition> {
        let zone: number = this.getZone(long, lat);

        this.logger.log(`Car ${license_plate} in zone ${zone} saved in db`);

        const position = new this.carPositionModel({
            "license_plate": license_plate,
            "zone": zone,
            "time": time,
        });
        return position.save();
    }


    async sendRealCarShutdown(licensePlate: string) {
        this.trackingShutdownClient.emit(
            'real-car-shutdown',
            {
                license_plate: licensePlate,
            }
        );

        this.logger.log(`Car ${licensePlate} send REAL_CAR_SHUTDOWN`);
    }


    getZone(long: number, lat: number): number {
        let zoneNumber = 0;
        this.cacheManager.get('zones').then((zones: PollutionZone[]) => {
            zones.forEach(zone => {
                const distance: number = this.getDistanceFromLatLonInKm(zone.centerLat, zone.centerLong, lat, long);

                if (distance <= zone.radiusEnd && distance >= zone.radiusStart) {
                    zoneNumber = zone.number;
                }
            })

        });

        return zoneNumber;
    }

    private getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180)
    }


    public get isConnected(): boolean {
        return true;
    }


}
