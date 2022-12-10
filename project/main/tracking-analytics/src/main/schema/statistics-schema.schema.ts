import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatisticsDocument = Statistics & Document;

@Schema()
export class Statistics {
    @Prop({})
    prop1: string;
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);
