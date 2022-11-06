import {Body, Controller, Get, Logger, Param, Post} from '@nestjs/common';
import {EventPattern, MessagePattern} from "@nestjs/microservices";
import {AppService} from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);


  @Post("/start-car")
  async startCar(@Body() body: {license_plate: string}) {
    return this.appService.startCar(body.license_plate);
  }

  @Post("/stop-car")
  async stopCar(@Body() body: {license_plate: string}) {
    return this.appService.stopCar(body.license_plate);
  }

  @Post("/edit-request-interval")
  async editRequestInterval(@Body() body: {license_plate: string, interval: number}) {
    return this.appService.editRequestInterval(body.license_plate, body.interval);
  }




  /*
  @Get("/get-hello")
  getHello() {
    return this.appService.getHello();
  }

  @MessagePattern({cmd: 'greeting'})
  getGreetingMessage(name: string): string {
    return `Hello ${name}`;
  }

  @MessagePattern({cmd: 'greeting-async'})
  async getGreetingMessageAysnc(name: string): Promise<string> {
    return `Hello ${name} Async`;
  }

  @EventPattern('book-created')
  async handleBookCreatedEvent(data: Record<string, unknown>) {
    console.log(data);
  }
  */
}
