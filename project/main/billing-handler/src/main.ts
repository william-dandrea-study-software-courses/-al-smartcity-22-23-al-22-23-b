import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from "@nestjs/common";
import {Transport} from "@nestjs/microservices";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port: number = Number(process.env.APP_PORT);
  await app.listen( port | 3000).then(() => {
    (new Logger("MAIN")).verbose(`Listening on port ${port}`);
  });
}
bootstrap();
