import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Bill } from './bill.schema';
import { Ticket } from './ticket.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    license_plate: string;

    @Prop({ required: true })
    bills: Bill[];

    @Prop({ required: true })
    tickets: Ticket[];
}

export const UserSchema = SchemaFactory.createForClass(User);
