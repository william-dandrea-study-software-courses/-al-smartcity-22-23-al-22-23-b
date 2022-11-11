interface CarShutdownEventDto {
    location: {
        lon: number;
        lat: number;
    };
    license_plate: string;
    time: string;
}
