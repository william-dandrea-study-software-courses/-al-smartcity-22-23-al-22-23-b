import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
    HttpModule
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule {}
