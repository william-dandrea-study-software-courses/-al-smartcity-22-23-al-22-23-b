import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { User, UserSchema } from "./schema/user.schema";
import {PrometheusModule} from "../prometheus/prometheus.module";


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin@bills-database:27017'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule,
      PrometheusModule
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule { }
