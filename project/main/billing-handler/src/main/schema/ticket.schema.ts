import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket {
    @Prop({ required: true })
    price: number;

    @Prop({ required: true, default: false })
    is_paid: boolean;

    @Prop({ required: true })
    date: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
