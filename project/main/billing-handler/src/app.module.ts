import { Module } from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {Bill, BillSchema} from "../schema/bill.schema";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://database-dev:27017/bill'),
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
    }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
