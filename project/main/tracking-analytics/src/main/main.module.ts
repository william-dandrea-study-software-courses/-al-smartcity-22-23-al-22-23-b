import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import {HttpModule} from "@nestjs/axios";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {MongooseModule} from "@nestjs/mongoose";
import {Statistics, StatisticsSchema} from "./schema/statistics-schema.schema";

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://car-statistics-database:27017'),
      MongooseModule.forFeature([{name: Statistics.name, schema: StatisticsSchema, collection: 'statistics'}]),
      HttpModule
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule {}
