import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import {HttpModule} from "@nestjs/axios";
import {MongooseModule} from "@nestjs/mongoose";
import {AntiFraud, AntiFraudSchema} from "./schema/anti-fraud.schema";

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot('mongodb://start-stop-database:27017'),
    MongooseModule.forFeature([{name: AntiFraud.name, schema: AntiFraudSchema}]),
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule {}
