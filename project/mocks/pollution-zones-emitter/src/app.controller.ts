import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/zone")
  async getZone(@Query() lon: number, @Query() lat: number): Promise<string> {
    return "1";
  }
}