import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import {HttpModule} from "@nestjs/axios";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {PrometheusModule} from "../prometheus/prometheus.module";

@Module({
  imports: [
    HttpModule,
      PrometheusModule,
    ClientsModule.register([
      {
        name: 'USER_POSITION_BUS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'position',
            brokers: ['kafka-event-bus:9092']
          },
          consumer: {
            groupId: 'user-position-proxy-consumer'
          }
        }
      }
    ]),
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule {}
