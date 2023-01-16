export class NewCarPositionDto {
    license_plate: string;
    location: {
        lon: number,
        lat: Number
    };
    time: string;
}