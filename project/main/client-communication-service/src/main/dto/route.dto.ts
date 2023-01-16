import { PollutionZone } from "../schema/pollution-zone.schema";

export class RouteDto {
    public license_plate: string;
    public route: any[][];
    public price: number;
    public zones: PollutionZone[]
}