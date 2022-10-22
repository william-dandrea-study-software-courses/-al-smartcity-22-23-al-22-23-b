import {Controller, Get, Logger} from '@nestjs/common';
import { AppService } from './app.service';
import {EventPattern} from "@nestjs/microservices";

@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get("/")
  getHello(): string {
    return this.appService.getHello();
  }



  @EventPattern('car-position')
  async handleBookCreatedEvent(data: Record<string, unknown>) {
    this.logger.log(data);
  }
}
