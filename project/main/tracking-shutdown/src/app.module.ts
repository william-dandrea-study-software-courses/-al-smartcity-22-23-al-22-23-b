import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import { MongooseModule } from '@nestjs/mongoose';
import {CarPosition, CarPositionSchema} from "./schema/car-position.schema";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://database-dev:27017/car-position'),
    MongooseModule.forFeature([{ name: CarPosition.name, schema: CarPositionSchema }]),
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
