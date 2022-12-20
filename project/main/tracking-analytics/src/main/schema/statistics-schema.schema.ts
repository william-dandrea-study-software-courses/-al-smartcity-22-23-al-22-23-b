import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {CarPositionModel, PositionType} from "../models/car-position.model";

export type StatisticsDocument = Statistics & Document;

@Schema()
export class Statistics {
    @Prop({ required: true })
    license_plate: string;

    @Prop({ required: true })
    bill: number;

    @Prop({ required: true })
    positions: CarPositionModel[];
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);
