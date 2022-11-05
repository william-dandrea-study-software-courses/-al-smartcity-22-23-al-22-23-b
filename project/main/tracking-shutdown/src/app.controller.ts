import {Controller, Get, Logger} from '@nestjs/common';
import { AppService } from './app.service';
import {EventPattern} from "@nestjs/microservices";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @EventPattern('real-car-shutdown')
  async handleCarShutdownEvent(data: Record<string, unknown>) {
    this.logger.log(data);
    await this.appService.onCarShutdownEvent(data)
  }
}
