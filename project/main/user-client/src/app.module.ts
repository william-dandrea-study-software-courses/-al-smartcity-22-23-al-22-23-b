import {CacheModule, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
  imports: [
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
