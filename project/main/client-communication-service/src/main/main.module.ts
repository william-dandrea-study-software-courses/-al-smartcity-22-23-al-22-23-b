import {CacheModule, Module} from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import {HttpModule} from "@nestjs/axios";
import {WebsocketGateway} from "./websocket.gateway";

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),

  ],
  controllers: [MainController],
  providers: [MainService, WebsocketGateway],
  exports: [MainService],
})
export class MainModule {}
