import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BillDocument = Bill & Document;

@Schema()
export class Bill {
    @Prop({ required: true })
    price: number;

    @Prop({ required: true, default: false })
    is_paid: boolean;

    @Prop({ required: true })
    date: Date;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
