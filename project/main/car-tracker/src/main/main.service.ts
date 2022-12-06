import {Inject, Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {CarPosition, CarPositionDocument} from "./schema/car-position.schema";
import {Model} from "mongoose";
import {HttpService} from "@nestjs/axios";
import {ClientProxy} from "@nestjs/microservices";
import {PollutionZone} from "./schema/pollution-zone.schema";

@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    private readonly zones: PollutionZone[] = [
        {
            "number": 1,
            "radiusStart": 0,
            "radiusEnd": 5,
            "centerLat": 48.857125,
            "centerLong": 2.350838
        },
        {
            "number": 2,
            "radiusStart": 5,
            "radiusEnd": 10,
            "centerLat": 48.857125,
            "centerLong": 2.350838
        },
        {
            "number": 3,
            "radiusStart": 10,
            "radiusEnd": 20,
            "centerLat": 48.857125,
            "centerLong": 2.350838
        }]

    constructor(
        @InjectModel(CarPosition.name) private carPositionModel: Model<CarPositionDocument>,
        private readonly httpService: HttpService,
        @Inject('RABBITMQ_SERVICE_TRACKING_SHUTDOWN') private trackingShutdownClient: ClientProxy,
    ) { }



    addPosition(license_plate: string, zone: string, time: string): Promise<CarPosition> {
        this.logger.log(`Car ${license_plate} in zone ${zone} saved in db`);

        const position = new this.carPositionModel({
            "license_plate": license_plate,
            "zone": zone,
            "time": time,
        });
        return position.save();
    }

    async getZonePollution(lon: number, lat: number): Promise<string> {
        return await this.httpService.axiosRef.get('http://mock-pollution-zones-emitter:3000/zone?lon=' + lon + "&lat=" + lat).then((response) => {
            return response.data;
        }).catch((error) => {
            console.log(error);
        });
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
        const pollutionZones: PollutionZone[] = this.zones;
        let zoneNumber = 0;
        pollutionZones.forEach(zone => {
            const distance: number = this.getDistanceFromLatLonInKm(zone.centerLat, zone.centerLong, lat, long);
            console.log(zone.number);
            console.log(distance<=zone.radiusEnd);
            console.log(distance>=zone.radiusStart);
            if (distance<=zone.radiusEnd && distance>=zone.radiusStart){
                zoneNumber = zone.number;
            }
        })
        return zoneNumber;
    }

    private getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
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

    private deg2rad(deg):number {
        return deg * (Math.PI/180)
    }


    public get isConnected(): boolean {
        return true;
    }
}
