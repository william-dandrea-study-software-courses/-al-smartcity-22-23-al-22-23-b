export class AskRouteDto {
    license_plate: string;
    locationStart: {
        lon: number,
        lat: Number
    };
    locationEnd: {
        lon: number,
        lat: Number
    };
}