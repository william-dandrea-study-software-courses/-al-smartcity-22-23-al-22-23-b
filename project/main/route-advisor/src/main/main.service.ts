import {CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import {Cache} from "cache-manager";
import {EventPattern} from "@nestjs/microservices";
import {PollutionZone} from "./model/pollution-zone.model";
import {HttpService} from "@nestjs/axios";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);
    private readonly CACHE_TTL: number = 60;    // en secondes
    private readonly CACHE_NAME: string = "CACHE_IDENTIFIER";

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache,
                private readonly httpService: HttpService,) {
    }

    @EventPattern('position_pattern')
    public receiveNewPosition(data: any) {
        console.log(data);
    }

    public get isConnected(): boolean {
        return true;
    }

    public getHello(): string {
        return "Hello World"
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
}
