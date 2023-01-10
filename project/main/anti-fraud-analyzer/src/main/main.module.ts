import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { AntiFraud, AntiFraudSchema } from "./schema/car-position.schema";
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot('mongodb://admin:admin@start-stop-database:27017'),
    MongooseModule.forFeature([{ name: AntiFraud.name, schema: AntiFraudSchema }]),
    ClientsModule.register([
      {
        name: 'USER_POSITION_BUS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud-analyzer',
            brokers: ['kafka-event-bus:9092']
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
            maxBytesPerPartition: 1576,

          }
        }
      }
    ])
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule { }
