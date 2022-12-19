


export class CarPositionSchema {
    license_plate: string;

    location: {
        lon: number,
        lat: number
    };

    time: string;
}
