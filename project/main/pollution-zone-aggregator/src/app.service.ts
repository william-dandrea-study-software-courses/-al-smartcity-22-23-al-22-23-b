import { Injectable } from '@nestjs/common';
import {PollutionZone} from "./schema/pollution-zone.schema";
import zones from "./zones.json"

@Injectable()
export class AppService {
  getHello(long: number, lat: number): number {
    const pollutionZones: PollutionZone[] = zones;
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
}
