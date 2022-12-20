

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AntiFraudDocument = AntiFraud & Document;

@Schema()
export class AntiFraud {
    @Prop({ required: true })
    prop1: string;

}

export const AntiFraudSchema = SchemaFactory.createForClass(AntiFraud);
