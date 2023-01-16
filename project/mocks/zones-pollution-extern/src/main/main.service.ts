import { Injectable, Logger } from '@nestjs/common';
import { PollutionZone } from './schema/pollution-zone.schema';
import {PrometheusService} from "../prometheus/prometheus.service";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    private numberOfGetZonesRequests = this.prometheusService.registerGauge("number_of_get_zones_requests", "number_of_get_zones_requests")
    private serviceUp = this.prometheusService.registerGauge("service_up", "service_up")
    // this.serviceUp.set(1);

    constructor(private prometheusService: PrometheusService) {
        this.serviceUp.set(1);
    }


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
        this.numberOfGetZonesRequests.inc(1);
        return this.zones;
    }

}
