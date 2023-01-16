import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {IsMongoId} from "class-validator";

export class Ticket {

    @IsMongoId()
    _id: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true, default: false })
    is_paid: boolean;

    @Prop({ required: true })
    date: Date;
}


export class Bill {

    @IsMongoId()
    _id: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true, default: false })
    is_paid: boolean;

    @Prop({ required: true })
    date: Date;
}

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
