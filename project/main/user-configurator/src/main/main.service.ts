import {CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {Cache} from "cache-manager";
import {PollutionZone} from "./schema/pollution-zone.schema";
import {CarPositionSchema} from "./models/car-position.schema";
import {PrometheusService} from "../prometheus/prometheus.service";


@Injectable()
export class MainService {

    private readonly CACHE_TTL: number = 60;    // en secondes
    private readonly CACHE_NAME: string = "CACHE_IDENTIFIER";
    private readonly logger = new Logger(MainService.name);

    private numberOfExternalRequests = this.prometheusService.registerGauge("number_of_external_requests", "number_of_external_requests");
    private numberOfSuccessExternalRequests = this.prometheusService.registerGauge("number_of_success_external_requests", "number_of_success_external_requests");
    private numberOfFailedExternalRequests = this.prometheusService.registerGauge("number_of_failed_external_requests", "number_of_failed_external_requests");

    private serviceUp = this.prometheusService.registerGauge("service_up", "service_up")
    // this.serviceUp.set(1);

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly httpService: HttpService,
        private prometheusService: PrometheusService,
    ) {
        this.serviceUp.set(1);
    }

    public async newPosition(infos: CarPositionSchema) {
        this.logger.log(infos);

        const frequency: number = await this.getCarFrequency(infos);

        const resultToSend = {
            "license_plate": infos.license_plate,
            "frequency": frequency,
            "time": (new Date()).toISOString(),
        }

        this.numberOfExternalRequests.inc(1);
        this.httpService.axiosRef.post("http://client-communication-service:3000/new-frequency", resultToSend).then(r => {
            this.logger.log("BOnjour")
            this.numberOfSuccessExternalRequests.inc(1);
        }, e => {
            this.numberOfFailedExternalRequests.inc(1);
            this.logger.error("Cannot communicate with client-communication-service")
            // throw new HttpException("Cannot communicate with client-communication-service", HttpStatus.UNPROCESSABLE_ENTITY)
        })
    }




    public getHello(): string {
        return "Hello World"
    }

    public get isConnected(): boolean {
        return true;
    }

    private async getCarFrequency(infos: CarPositionSchema): Promise<number> {
        const zones: PollutionZone[] = await this.getOfficialZone();
        const mapZones: number[] = zones.map(z => z.number);
        const carZoneNumber: number = await this.getZoneWhereIsTheUser(infos.location.lon, infos.location.lat);

        if (carZoneNumber === 0 && zones.length > 1) {
            const lastZone: PollutionZone = zones[mapZones.indexOf(Math.max(...mapZones))];
            const distance: number = this.getDistanceBetween2Points(lastZone.centerLat, lastZone.centerLong, infos.location.lat, infos.location.lon) - lastZone.radiusEnd;
            return this.generateFrequencyOfPosition(distance)
        }

        const carZone: PollutionZone = zones[mapZones.indexOf(carZoneNumber)];
        const distanceBetweenMinBorder: number = this.getDistanceBetween2Points(carZone.centerLat, carZone.centerLong, infos.location.lat, infos.location.lon) - carZone.radiusStart;
        const distanceBetweenMaxBorder: number = this.getDistanceBetween2Points(carZone.centerLat, carZone.centerLong, infos.location.lat, infos.location.lon) - carZone.radiusEnd;

        return this.generateFrequencyOfPosition(Math.min(distanceBetweenMinBorder, distanceBetweenMaxBorder))
    }

    public async getZoneWhereIsTheUser(lon: number, lat: number): Promise<number> {

        await this.getOfficialZone().then(zones => {
            this.numberOfSuccessExternalRequests.inc(1);
            zones.forEach(zone => {
                const distanceBetweenCenterAndUser: number = this.getDistanceBetween2Points(zone.centerLat, zone.centerLong, lat, lon);
                if (distanceBetweenCenterAndUser >= zone.radiusStart && distanceBetweenCenterAndUser < zone.radiusEnd) {
                    return zone.number;
                }
            })
        }).catch(e => {
            this.numberOfFailedExternalRequests.inc(1);
            this.logger.error("Cannot communicate with zones-pollution-extern")
        });



        return 0;
    }

    private async getOfficialZone(): Promise<PollutionZone[]> {
        const result: PollutionZone[] | undefined = await this.cacheManager.get(this.CACHE_NAME)

        if (result == undefined) {
            this.logger.log("Update")

            this.numberOfExternalRequests.inc(1);
            return await this.httpService.axiosRef.get('http://zones-pollution-extern:3000/zones').then(async (response) => {
                await this.cacheManager.set(this.CACHE_NAME, response.data, this.CACHE_TTL * 1000);
                const newResult: PollutionZone[] = await this.cacheManager.get(this.CACHE_NAME);
                return newResult
            }) /*.catch((error) => {
                this.logger.log("Cannot communicate with zone-pollution-extern")
                // throw new HttpException("Cannot communicate with zone-pollution-extern", HttpStatus.UNPROCESSABLE_ENTITY)
            }); */

        } else {
            this.logger.log("Respond")
            return result
        }
    }


    /**
     * Return the frequency between each moment the user need to send the position in the bus
     */
    private generateFrequencyOfPosition(distance: number) {

        if (distance < 50) {
            return 1 // Envoi de position toutes les secondes
        } else if (distance >= 50 && distance < 200) {
            return 5 // Envoi de position toutes 5 secondes
        } else if (distance >= 200 && distance < 500) {
            return 10 // Envoi de position toutes 10 secondes
        } else if (distance >= 500 && distance < 1000) {
            return 30 // Envoi de position toutes 30 secondes
        } else {
            return 60 // Envoi de position toutes 60 secondes
        }
    }

    private getDistanceBetween2Points(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180)
    }


}
