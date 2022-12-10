import {Module} from '@nestjs/common';
import {MainController} from './main.controller';
import {MainService} from './main.service';
import {MongooseModule} from "@nestjs/mongoose";
import {CarPosition, CarPositionSchema} from "./schema/car-position.schema";
import {HttpModule} from "@nestjs/axios";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
      MongooseModule.forFeature([{ name: CarPosition.name, schema: CarPositionSchema }]),
      MongooseModule.forRoot('mongodb://tracking-infos-database:27017'),
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
      HttpModule
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule {}
