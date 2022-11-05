import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarPositionDocument = CarPosition & Document;

@Schema()
export class CarPosition {
    @Prop({ required: true })
    license_plate: string;

    @Prop({ required: true })
    zone: string;

    @Prop({ required: true })
    time: string;
}

export const CarPositionSchema = SchemaFactory.createForClass(CarPosition);
