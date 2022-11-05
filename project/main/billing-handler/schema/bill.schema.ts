import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BillDocument = Bill & Document;

@Schema()
export class Bill {
    @Prop({ required: true })
    license_plate: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true, default: false })
    is_paid: boolean;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
