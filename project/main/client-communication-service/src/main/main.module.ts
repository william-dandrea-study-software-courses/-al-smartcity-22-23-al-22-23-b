import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import {HttpModule} from "@nestjs/axios";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {WebSocketGateway} from "@nestjs/websockets";
import {WebsocketGateway} from "./websocket.gateway";

@Module({
  imports: [
    HttpModule
  ],
  controllers: [MainController],
  providers: [MainService, WebsocketGateway],
  exports: [MainService],
})
export class MainModule {}
