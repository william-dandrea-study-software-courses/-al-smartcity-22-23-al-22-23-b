import { Document } from 'mongoose';
export declare type CarPositionDocument = CarPosition & Document;
export declare class CarPosition {
    license_plate: string;
    location: string;
    time: string;
}
export declare const CarPositionSchema: any;
