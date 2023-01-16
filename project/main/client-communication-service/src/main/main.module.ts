import {CacheModule, Module} from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import {HttpModule} from "@nestjs/axios";
import {WebsocketGateway} from "./websocket.gateway";
import {CacheServiceLicensePlate} from "./cache-license-plate.service";
import * as redisStore from 'cache-manager-redis-store';
import {PrometheusModule} from "../prometheus/prometheus.module";


// redis://client-communication-socket-authentification-cache:6379
@Module({
  imports: [
      PrometheusModule,
    HttpModule,
    CacheModule.register({
      store: redisStore,
      url: 'redis://redis:6379',
      ttl: 0,
    }),

    // CacheModule.register({
    //   // isGlobal: true,
    //   store: 'redis',
    //   socket: {
    //     host: 'client-communication-socket-authentification-cache', // default value
    //     port: 6379, // default value
    //   },
    //   // host: 'client-communication-socket-authentification-cache',
    //   // port: '6379',
    //   // password: 'your-redis-password',
    //   // ttl: 0, // temps de vie en secondes
    //   // max: 10, // nombre maximum de clés en cache
    // }),
  ],
  controllers: [MainController],
  providers: [MainService, WebsocketGateway, CacheServiceLicensePlate],
  exports: [MainService],
})
export class MainModule {}
