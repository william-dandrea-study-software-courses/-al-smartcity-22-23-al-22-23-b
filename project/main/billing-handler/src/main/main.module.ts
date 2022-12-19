import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import {MongooseModule} from "@nestjs/mongoose";
import {HttpModule} from "@nestjs/axios";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {Bill, BillSchema} from "./schema/bill.schema";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://bills-database:27022'),
    MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
    HttpModule
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule {}
