import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CarPosition, CarPositionDocument } from './schema/car-position.schema';

@Injectable()
export class AppService {

  constructor(@InjectModel(CarPosition.name) private carPositionModel: Model<CarPositionDocument>, private readonly httpService: HttpService) { }

  addPosition(license_plate: string, zone: string, time: string): Promise<CarPosition> {
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

  getHello(): string {
    return 'Hello World!';
  }
}
