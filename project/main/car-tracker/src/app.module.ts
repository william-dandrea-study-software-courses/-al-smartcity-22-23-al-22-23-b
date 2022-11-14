import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from '@nestjs/mongoose';
import { CarPosition, CarPositionSchema } from './main/schema/car-position.schema';
import { HttpModule } from '@nestjs/axios';
import {ConfigModule} from "@nestjs/config";
import {HealthModule} from "./health/health.module";
import {PrometheusModule} from "./prometheus/prometheus.module";
import {MetricsModule} from "./metrics/metrics.module";
import { MainModule } from './main/main.module';


@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    HttpModule,
    HealthModule,
    PrometheusModule,
    MetricsModule,
    MainModule,
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule { }
