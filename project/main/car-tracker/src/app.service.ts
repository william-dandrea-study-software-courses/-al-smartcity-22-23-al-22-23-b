import { HttpService } from '@nestjs/axios';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CarPosition, CarPositionDocument } from './schema/car-position.schema';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  constructor(
      @InjectModel(CarPosition.name) private carPositionModel: Model<CarPositionDocument>,
      private readonly httpService: HttpService,
      @Inject('RABBITMQ_SERVICE_TRACKING_SHUTDOWN') private trackingShutdownClient: ClientProxy,
      ) { }

  addPosition(license_plate: string, zone: string, time: string): Promise<CarPosition> {
    this.logger.log(`Car ${license_plate} in zone ${zone} saved in db`);

    const position = new this.carPositionModel({
      "license_plate": license_plate,
      "zone": zone,
      "time": time,
    });
    return position.save();
  }

  async getZonePollution(lon: number, lat: number): Promise<string> {
    return await this.httpService.axiosRef.get('http://mock-pollution-zones-emitter-dev:3000/zone?lon=' + lon + "&lat=" + lat).then((response) => {
      return response.data;
    }).catch((error) => {
      console.log(error);
    });
  }

  async sendRealCarShutdown(licensePlate: string) {
    this.trackingShutdownClient.emit(
      'real-car-shutdown',
      {
        license_plate: licensePlate,
      }
    );

    this.logger.log(`Car ${licensePlate} send REAL_CAR_SHUTDOWN`);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
