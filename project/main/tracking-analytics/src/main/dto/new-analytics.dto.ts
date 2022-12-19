import {CarPositionModel} from "../models/car-position.model";


export class NewAnalyticsDto {
    license_plate: string;
    bill: number;
    positions: CarPositionModel[];
}
