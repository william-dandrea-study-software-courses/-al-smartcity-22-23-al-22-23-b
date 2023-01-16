import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectModel } from "@nestjs/mongoose";
import { CarPosition, CarPositionDocument, PositionType } from "./schema/car-position.schema";
import { Model } from "mongoose";
import { HttpService } from "@nestjs/axios";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";
import { PollutionZone } from "./schema/pollution-zone.schema";
import {PrometheusService} from "../prometheus/prometheus.service";

@Injectable()
export class MainService {
    private readonly CACHE_TTL: number = 60;    // en secondes
    private readonly CACHE_NAME: string = "CACHE_IDENTIFIER";
    private readonly logger = new Logger(MainService.name);

    private numberOfOutputRequestGauge = this.prometheusService.registerGauge("number_of_output_requests", "number_of_output_requests");
    private numberOfSuccessOutputRequestGauge = this.prometheusService.registerGauge("number_of_success_output_requests", "number_of_success_output_requests");
    private numberOfFailedOutputRequestGauge = this.prometheusService.registerGauge("number_of_failed_output_requests", "number_of_failed_output_requests");
    private numberOfDatabaseCall = this.prometheusService.registerGauge("number_of_database_call", "number_of_database_call")
    private numberOfTrackingShutdownEmitEvents = this.prometheusService.registerGauge("number_of_tracking_shutdown_emit_events", "number_of_tracking_shutdown_emit_events")
    private numberOfCacheRequest = this.prometheusService.registerGauge("number_of_cache_request", "number_of_cache_request")

    private serviceUp = this.prometheusService.registerGauge("service_up", "service_up")
    // this.serviceUp.set(1);

    constructor(
        @InjectModel(CarPosition.name) private carPositionModel: Model<CarPositionDocument>,
        private readonly httpService: HttpService,
        @Inject('RABBITMQ_SERVICE_TRACKING_SHUTDOWN') private trackingShutdownClient: ClientProxy,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private prometheusService: PrometheusService,
    ) {
        this.serviceUp.set(1);
    }


    addPosition(license_plate: string, long: number, lat: number, time: string, positionType: PositionType): Promise<CarPosition> {
        let zone: number = this.getZone(long, lat);

        this.logger.log(`Car ${license_plate} in zone ${zone} saved in db`);

        const position = new this.carPositionModel({
            "license_plate": license_plate,
            "zone": zone,
            "time": time,
            "type": positionType,
        });
        this.numberOfDatabaseCall.inc(1);
        return position.save();
    }


    async sendRealCarShutdown(licensePlate: string) {

        this.trackingShutdownClient.emit(
            'real-car-shutdown',
            {
                license_plate: licensePlate,
            }
        );
        this.numberOfTrackingShutdownEmitEvents.inc(1);
        this.logger.log(`Car ${licensePlate} send REAL_CAR_SHUTDOWN`);
    }


    getZone(long: number, lat: number): number {
        let zoneNumber = 0;

        this.getOfficialZone().then((zones: PollutionZone[]) => {
            zones.forEach(zone => {
                const distance: number = this.getDistanceFromLatLonInKm(zone.centerLat, zone.centerLong, lat, long);

                if (distance <= zone.radiusEnd && distance >= zone.radiusStart) {
                    zoneNumber = zone.number;
                }
            })

        }).catch(e => {
            this.logger.error("Cannot communicate with zone-pollution-extern")
        });

        return zoneNumber;
    }

    private async getOfficialZone(): Promise<PollutionZone[]> {
        const result: PollutionZone[] | undefined = await this.cacheManager.get(this.CACHE_NAME)
        this.numberOfCacheRequest.inc(1);

        if (result == undefined) {
            this.logger.log("Update")

            return await this.httpService.axiosRef.get('http://zones-pollution-extern:3000/zones').then(async (response) => {
                this.numberOfOutputRequestGauge.inc(1);
                this.numberOfSuccessOutputRequestGauge.inc(1);
                await this.cacheManager.set(this.CACHE_NAME, response.data, this.CACHE_TTL * 1000);
                this.numberOfCacheRequest.inc(1);
                this.numberOfCacheRequest.inc(1);
                const newResult: PollutionZone[] = await this.cacheManager.get(this.CACHE_NAME);
                return newResult
            }).catch((error) => {

                this.numberOfFailedOutputRequestGauge.inc(1);
                this.numberOfOutputRequestGauge.inc(1);
                throw new HttpException("Cannot communicate with zone-pollution-extern", HttpStatus.UNPROCESSABLE_ENTITY)
            });

        } else {
            this.logger.log("Respond")
            return result
        }
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
