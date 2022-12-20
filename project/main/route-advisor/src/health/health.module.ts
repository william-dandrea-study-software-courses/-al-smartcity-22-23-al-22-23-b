import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { TerminusModule } from '@nestjs/terminus';
import { PrometheusModule } from '../prometheus/prometheus.module';
import {MainModule} from "../main/main.module";
@Module({
  imports: [ TerminusModule, PrometheusModule, MainModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
