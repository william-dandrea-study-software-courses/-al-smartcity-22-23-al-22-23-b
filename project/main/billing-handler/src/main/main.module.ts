import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Bill, BillSchema } from "./schema/bill.schema";
import { Ticket, TicketSchema } from "./schema/ticket.schema";
import { User, UserSchema } from "./schema/user.schema";
import {PrometheusModule} from "../prometheus/prometheus.module";


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin@bills-database:27017'),
    MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule,
      PrometheusModule
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule { }
