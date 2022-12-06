import {CacheModule, Module} from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import {HttpModule} from "@nestjs/axios";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    ScheduleModule.forRoot(),
    ClientsModule.register([{
      name: 'RABBITMQ_SERVICE_CAR_TRACKER_QUEUE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@car-tracker-bus:5672'],
        queue: 'car-info-queue',
        queueOptions: {
          durable: false
        }
      }
    }]),
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule {}
