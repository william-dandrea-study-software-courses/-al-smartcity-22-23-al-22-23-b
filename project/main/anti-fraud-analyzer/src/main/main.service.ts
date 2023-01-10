import { Inject, Injectable, Logger } from '@nestjs/common';
import { CarLocation, AntiFraud, AntiFraudDocument } from './schema/car-position.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    constructor(@InjectModel(AntiFraud.name) private antiFraudModel: Model<AntiFraudDocument>, private readonly httpService: HttpService) { }

    public get isConnected(): boolean {
        return true;
    }


    public async isFraudulent(licensePlate: string, locationStart: CarLocation): Promise<boolean> {
        const carPosition: AntiFraud = await this.antiFraudModel.findOne({ license_plate: licensePlate });

        if (carPosition) {
            await this.antiFraudModel.findOneAndUpdate({ license_plate: licensePlate }, { start: locationStart });
            this.logger.log("start position updated for " + licensePlate);

            if (locationStart.lat === carPosition.stop.lat && locationStart.lon === carPosition.stop.lon) {
                this.logger.log("car is not fraudulent: " + licensePlate);
                return false;
            } else {
                this.logger.log("fraudulent car detected: " + licensePlate);
                return true;
            }
        } else {
            await this.saveNewLicensePlate(licensePlate, locationStart);
            this.logger.log("new license plate saved", carPosition);
            return false;
        }

    }


    private async saveNewLicensePlate(licensePlate: string, locationStart: CarLocation): Promise<AntiFraud> {
        const newPlate: AntiFraud = new AntiFraud();
        newPlate.license_plate = licensePlate;
        newPlate.start = locationStart;
        newPlate.stop = locationStart;
        return await this.antiFraudModel.create(newPlate);
    }


    public async updateStop(licensePlate: string, locationStop: CarLocation) {
        await this.antiFraudModel.findOneAndUpdate({ license_plate: licensePlate }, { stop: locationStop });
        this.logger.log("stop position updated for " + licensePlate);
    }





    public async checkCamera(licensePlate: string) {
        const res = await this.httpService.axiosRef.get('http://camera-checker:3000/check');
        if (res.data) {
            this.logger.log("fraudulent car detected: " + licensePlate);
            this.sendTicket(licensePlate);
        }
    }

    public sendTicket(licensePlate: string) {
        this.httpService.axiosRef.post('http://billing-handler:3000/add-ticket/' + licensePlate, { price: 5 }).then(res => {
            this.logger.log("ticket sent to " + licensePlate);
        }).catch(err => {
            this.logger.error("error sending ticket to " + licensePlate);
        });
    }

}
