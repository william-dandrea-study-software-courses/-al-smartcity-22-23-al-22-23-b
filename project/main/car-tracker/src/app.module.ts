import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from '@nestjs/mongoose';
import { CarPosition, CarPositionSchema } from './schema/car-position.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ClientsModule.register([{
      name: 'RABBITMQ_SERVICE_TRACKING_SHUTDOWN',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@car-tracker-bus:5672'],
        queue: 'tracking-shutdown-queue',
        queueOptions: {
          durable: false
        }
      }
    }]),
    MongooseModule.forRoot('mongodb://database-dev:27017/car-position'),
    MongooseModule.forFeature([{ name: CarPosition.name, schema: CarPositionSchema }]),
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
