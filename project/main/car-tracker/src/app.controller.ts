import { Controller, Get, Logger, Injectable } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from "@nestjs/microservices";

@Injectable()
@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) { }

  @Get("/")
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('car-shutdown')
  async handleCarShutdown(data: Record<string, string>) {
    const zone = await this.appService.getZonePollution(data.location['lon'], data.location['lat']);
    this.appService.addPosition(data.license_plate, zone, data.time);

    this.appService.sendRealCarShutdown(data.license_plate);
  }

  @EventPattern('car-position')
  async handleCarPosition(data: Record<string, string>) {
    const zone = await this.appService.getZonePollution(data.location['lon'], data.location['lat']);
    this.appService.addPosition(data.license_plate, zone, data.time);
  }
}
