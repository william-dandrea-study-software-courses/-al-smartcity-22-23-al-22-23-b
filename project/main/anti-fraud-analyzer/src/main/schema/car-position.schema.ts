import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AntiFraudDocument = AntiFraud & Document;

export class CarLocation {
    @Prop({ required: true })
    lon: number;

    @Prop({ required: true })
    lat: number;
}


@Schema()
export class AntiFraud {
    @Prop({ required: true })
    license_plate: string;

    @Prop({ required: true })
    start: CarLocation;

    @Prop({ required: true })
    stop: CarLocation;
}

export const AntiFraudSchema = SchemaFactory.createForClass(AntiFraud);

