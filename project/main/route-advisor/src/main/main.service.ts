import {CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import {Cache} from "cache-manager";
import {EventPattern} from "@nestjs/microservices";
import {PollutionZone} from "./model/pollution-zone.model";
import {HttpService} from "@nestjs/axios";
import {AskRouteDto} from "./dto/ask-route.dto";
import {RouteDto} from "./dto/route.dto";
import {PrometheusService} from "../prometheus/prometheus.service";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);
    private readonly CACHE_TTL: number = 60;    // en secondes
    private readonly CACHE_NAME: string = "CACHE_IDENTIFIER";

    private numberOfExternalRequests = this.prometheusService.registerGauge("number_of_external_requests", "number_of_external_requests");
    private numberOfSuccessExternalRequests = this.prometheusService.registerGauge("number_of_success_external_requests", "number_of_success_external_requests");
    private numberOfFailedExternalRequests = this.prometheusService.registerGauge("number_of_failed_external_requests", "number_of_failed_external_requests");


    private serviceUp = this.prometheusService.registerGauge("service_up", "service_up")
    // this.serviceUp.set(1);

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache,
                private readonly httpService: HttpService,
                private prometheusService: PrometheusService
                ) {
        this.serviceUp.set(1);
    }

    public get isConnected(): boolean {
        return true;
    }

    async getRoutePrice(points: any[][]): Promise<number> {
        let price = 0;
        for (const point of points) {
            price += this.getZonePrice(await this.getZone(point[0], point[1]))
        }
        return price;
    }

    async getFullRouteAndSendIt(askRoute: AskRouteDto) {
        let finalRoute: RouteDto = new RouteDto();
        finalRoute.license_plate = askRoute.license_plate;
        this.numberOfExternalRequests.inc(1);
        await this.httpService.axiosRef.get(
            `http://osrm:5000/route/v1/driving/${askRoute.locationStart.lon},${askRoute.locationStart.lat};${askRoute.locationEnd.lon},${askRoute.locationEnd.lat}?geometries=geojson`)
            .then(resp => {
                finalRoute.route = resp.data.routes[0].geometry.coordinates;
                this.numberOfSuccessExternalRequests.inc(1);
            }).catch(e => {
                this.numberOfFailedExternalRequests.inc(1);
            });


        finalRoute.price = await this.getRoutePrice(finalRoute.route);
        finalRoute.zones = await this.getOfficialZone();
        this.numberOfExternalRequests.inc(1);
        await this.httpService.axiosRef.post("http://client-communication-service:3000/route", finalRoute).then(r => {
            this.logger.log("Bonjour");
            this.numberOfSuccessExternalRequests.inc(1);
        }, e => {
            this.numberOfFailedExternalRequests.inc(1);
            this.logger.error("Cannot communicate with client-communication-service");
        });
    }


    private getZonePrice(numberZone: number): number{
        switch (numberZone){
            case 1:
                return 50;
            case 2:
                return 30;
            case 3:
                return 10
            default:
                return 5;
        }
    }
    // @ts-ignore
    private async getZone(long: number, lat: number): number {
        let zoneNumber = 0;

        await this.getOfficialZone().then((zones: PollutionZone[]) => {
            zones.forEach(zone => {
                const distance: number = this.getDistanceFromLatLonInKm(zone.centerLat, zone.centerLong, lat, long);
                if (distance <= zone.radiusEnd && distance >= zone.radiusStart) {
                    zoneNumber = zone.number;
                }
            })

        }).catch(e => {
            this.logger.log("Cannot get the zones")
        });
        return zoneNumber;
    }

    private async getOfficialZone(): Promise<PollutionZone[]> {
        const result: PollutionZone[] | undefined = await this.cacheManager.get(this.CACHE_NAME)

        if (result == undefined) {
            this.logger.log("Update")

            this.numberOfExternalRequests.inc(1);
            return await this.httpService.axiosRef.get('http://zones-pollution-extern:3000/zones').then(async (response) => {
                await this.cacheManager.set(this.CACHE_NAME, response.data, this.CACHE_TTL * 1000);
                const newResult: PollutionZone[] = await this.cacheManager.get(this.CACHE_NAME);
                this.numberOfSuccessExternalRequests.inc(1);
                return newResult
            }).catch((error) => {
                this.numberOfFailedExternalRequests.inc(1);
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
}
