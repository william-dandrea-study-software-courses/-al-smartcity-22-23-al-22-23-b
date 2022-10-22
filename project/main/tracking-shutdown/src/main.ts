import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from "@nestjs/common";
import {AppController} from "./app.controller";
import {Transport} from "@nestjs/microservices";

const logger = new Logger(AppController.name);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservice = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@car-tracker-bus:5672'],
      queue: 'car-info-queue',
      queueOptions: {
        durable: false
      },
    },
  });
  await app.startAllMicroservices();

  const port: number = Number(process.env.APP_PORT);
  await app.listen( port | 3000).then(() => {
    logger.verbose(`Listening on port ${port}`);
  });
}
bootstrap();
