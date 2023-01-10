import {CacheModule, Module} from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import {HttpModule} from "@nestjs/axios";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    HttpModule,
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
            groupId: 'car-tracker-consumer'
          }
        }
      }
    ]),
    CacheModule.register()
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule {}
