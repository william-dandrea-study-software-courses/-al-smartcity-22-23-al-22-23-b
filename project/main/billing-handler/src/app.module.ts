import { Module } from '@nestjs/common';
import {HealthModule} from "./health/health.module";
import {PrometheusModule} from "./prometheus/prometheus.module";
import {MetricsModule} from "./metrics/metrics.module";
import {MainModule} from "./main/main.module";
import {HttpModule} from "@nestjs/axios";
import {ConfigModule} from "@nestjs/config";

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
})
export class AppModule {}
