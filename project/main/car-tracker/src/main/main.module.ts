import { Module, CacheModule } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { MongooseModule } from "@nestjs/mongoose";
import { CarPosition, CarPositionSchema } from "./schema/car-position.schema";
import { HttpModule } from "@nestjs/axios";
import { ClientsModule, Transport } from "@nestjs/microservices";
import {PrometheusModule} from "../prometheus/prometheus.module";

@Module({
  imports: [
      PrometheusModule,
    MongooseModule.forFeature([{ name: CarPosition.name, schema: CarPositionSchema }]),
    MongooseModule.forRoot('mongodb://admin:admin@tracking-infos-database:27017'),
    ClientsModule.register([{
      name: 'RABBITMQ_SERVICE_TRACKING_SHUTDOWN',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@tracking-shutdown-queue:5672'],
        queue: 'tracking-shutdown-queue',
        queueOptions: {
          durable: false
        }
      }
    }]),
    ClientsModule.register([
      {
        name: 'USER_POSITION_BUS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'car-tracker',
            brokers: ['kafka-event-bus:9092']
          },
          consumer: {
            groupId: 'car-tracker-consumer',

          }
        }
      }
    ]),
    CacheModule.register(),
    HttpModule
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule { }
