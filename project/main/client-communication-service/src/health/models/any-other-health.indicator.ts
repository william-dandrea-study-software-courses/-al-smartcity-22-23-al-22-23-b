import { BaseHealthIndicator } from './base-health.indicator';
import { HealthIndicator } from '../interfaces/health-indicator.interface';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { PrometheusService } from '../../prometheus/prometheus.service';
import {MainService} from "../../main/main.service";

export class AnyOtherHealthIndicator
  extends BaseHealthIndicator
  implements HealthIndicator {
  public readonly name = 'AnyOtherCustomHealthIndicator';
  protected readonly help = 'Status of ' + this.name;

  constructor(
    private service: MainService,
    protected promClientService: PrometheusService
  ) {
    super();
    // this.registerMetrics();
    this.registerGauges();
  }

  public async isHealthy(): Promise<HealthIndicatorResult> {
    const isHealthy = this.service.isConnected;
    this.updatePrometheusData(isHealthy);
    return this.getStatus(this.name, isHealthy);
  }
}
