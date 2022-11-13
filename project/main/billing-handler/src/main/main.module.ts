import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import {MongooseModule} from "@nestjs/mongoose";
import {HttpModule} from "@nestjs/axios";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {Bill, BillSchema} from "./schema/bill.schema";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://database:27017/bill'),
    MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
    ClientsModule.register([{
      name: 'RABBITMQ_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@car-tracker-bus:5672'],
        queue: 'car-info-queue',
        queueOptions: {
          durable: false
        }
      }
    }]),
    HttpModule
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule {}
