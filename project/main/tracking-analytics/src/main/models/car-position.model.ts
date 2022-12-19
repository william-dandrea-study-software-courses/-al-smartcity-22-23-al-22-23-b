

export class CarPositionModel {
    license_plate: string;
    zone: string;
    time: string;
    type: PositionType;
}

export enum PositionType {
    START="START",
    POSITION="POSITION",
    STOP="STOP"
}
