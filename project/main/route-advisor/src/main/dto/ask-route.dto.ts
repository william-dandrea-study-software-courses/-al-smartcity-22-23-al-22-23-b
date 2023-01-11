export class AskRouteDto {
    license_plate: string;
    locationStart: {
        lon: number,
        lat: number
    };
    locationEnd: {
        lon: number,
        lat: number
    };
}