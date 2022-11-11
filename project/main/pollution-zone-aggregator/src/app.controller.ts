import {Controller, Post, Query} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("zone")
  getZone(@Query() query: {long: number,  lat: number}) {
    return this.appService.getHello(query.long, query.lat)
  }
}
