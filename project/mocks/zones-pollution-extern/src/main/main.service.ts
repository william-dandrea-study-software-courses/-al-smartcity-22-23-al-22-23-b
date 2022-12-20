import { Injectable, Logger } from '@nestjs/common';
import { PollutionZone } from './schema/pollution-zone.schema';


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

    public get isConnected(): boolean {
        return true;
    }


    getZones() {
        return this.zones;
    }

}
