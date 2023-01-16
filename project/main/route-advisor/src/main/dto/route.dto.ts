import { PollutionZone } from "../model/pollution-zone.model";

export class RouteDto {
    public license_plate: string;
    public route: any[][];
    public price: number;
    public zones: PollutionZone[];
}