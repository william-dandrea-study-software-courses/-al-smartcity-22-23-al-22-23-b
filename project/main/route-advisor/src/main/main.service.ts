import {CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import {Cache} from "cache-manager";
import {EventPattern} from "@nestjs/microservices";
import {PollutionZone} from "./model/pollution-zone.model";
import {HttpService} from "@nestjs/axios";
import {AskRouteDto} from "./dto/ask-route.dto";
import {RouteDto} from "./dto/route.dto";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);
    private readonly CACHE_TTL: number = 60;    // en secondes
    private readonly CACHE_NAME: string = "CACHE_IDENTIFIER";
    private polyline = require('polyline')

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache,
                private readonly httpService: HttpService,) {
    }

    public get isConnected(): boolean {
        return true;
    }

    getFullRouteAndSendIt(askRoute: AskRouteDto){
        console.log(askRoute);
        let pointsList: [];
        let finalRoute: RouteDto = new RouteDto();
        finalRoute.license_plate=askRoute.license_plate;
        this.httpService.axiosRef.get(
            `http://osrm:5000/route/v1/driving/${askRoute.locationStart.lon},
        ${askRoute.locationStart.lat};${askRoute.locationEnd.lon},${askRoute.locationStart.lat}`)
            .then(resp => {
                finalRoute.route=resp.data.geometry
                pointsList = this.polyline.decode(resp.data.geometry)
            });
        pointsList.forEach(point => finalRoute.price += this.getZonePrice(this.getZone(point[0], point[1])));
        this.httpService.axiosRef.post("http://client-communication-service:3000/route", finalRoute)
    }

    private getZonePrice(numberZone: number){
        switch (numberZone){
            case 1:
                return 0.50;
            case 2:
                return 0.25;
            case 3:
                return 0.10
            default:
                return 0;
        }
    }
    // @ts-ignore
    private async getZone(long: number, lat: number): number {
        let zoneNumber = 0;

        this.getOfficialZone().then((zones: PollutionZone[]) => {
            zones.forEach(zone => {
                const distance: number = this.getDistanceFromLatLonInKm(zone.centerLat, zone.centerLong, lat, long);

                if (distance <= zone.radiusEnd && distance >= zone.radiusStart) {
                    zoneNumber = zone.number;
                }
            })

        });

        return zoneNumber;
    }

    private async getOfficialZone(): Promise<PollutionZone[]> {
        const result: PollutionZone[] | undefined = await this.cacheManager.get(this.CACHE_NAME)

        if (result == undefined) {
            this.logger.log("Update")

            return await this.httpService.axiosRef.get('http://zones-pollution-extern:3000/zones').then(async (response) => {
                await this.cacheManager.set(this.CACHE_NAME, response.data, this.CACHE_TTL * 1000);
                const newResult: PollutionZone[] = await this.cacheManager.get(this.CACHE_NAME);
                return newResult
            }).catch((error) => {
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
