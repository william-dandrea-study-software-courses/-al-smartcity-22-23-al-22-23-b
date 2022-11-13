import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import {HttpModule} from "@nestjs/axios";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {MongooseModule} from "@nestjs/mongoose";
import {CarPosition, CarPositionSchema} from "./schema/car-position.schema";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://database:27017/car-position'),
    MongooseModule.forFeature([{ name: CarPosition.name, schema: CarPositionSchema }]),
    HttpModule
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule {}
