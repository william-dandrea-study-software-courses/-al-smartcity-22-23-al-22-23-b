import { Inject, Injectable, Logger } from '@nestjs/common';
import { CarLocation, AntiFraud, AntiFraudDocument } from './schema/car-position.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import {PrometheusService} from "../prometheus/prometheus.service";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    private numberOfOutputRequestGauge = this.prometheusService.registerGauge("number_of_output_requests", "number_of_output_requests");
    private numberOfSuccessOutputRequestGauge = this.prometheusService.registerGauge("number_of_success_output_requests", "number_of_success_output_requests");
    private numberOfFailedOutputRequestGauge = this.prometheusService.registerGauge("number_of_failed_output_requests", "number_of_failed_output_requests");
    private numberOfDatabaseCallGauge = this.prometheusService.registerGauge("number_of_database_call", "number_of_database_call")
    // private prometheusService: PrometheusService

    constructor(
        @InjectModel(AntiFraud.name) private antiFraudModel: Model<AntiFraudDocument>,
        private readonly httpService: HttpService,
        private prometheusService: PrometheusService
    ) { }

    public get isConnected(): boolean {
        return true;
    }

    public async isFraudulent(licensePlate: string, locationStart: CarLocation): Promise<boolean> {
        const carPosition: AntiFraud = await this.antiFraudModel.findOne({ license_plate: licensePlate });
        this.numberOfDatabaseCallGauge.inc(1);

        if (carPosition) {
            await this.antiFraudModel.findOneAndUpdate({ license_plate: licensePlate }, { start: locationStart });
            this.numberOfDatabaseCallGauge.inc(1);
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
        this.numberOfDatabaseCallGauge.inc(1);
        return await this.antiFraudModel.create(newPlate);
    }


    public async updateStop(licensePlate: string, locationStop: CarLocation) {
        await this.antiFraudModel.findOneAndUpdate({ license_plate: licensePlate }, { stop: locationStop });
        this.numberOfDatabaseCallGauge.inc(1);
        this.logger.log("stop position updated for " + licensePlate);
    }





    public async checkCamera(licensePlate: string) {
        this.numberOfOutputRequestGauge.inc(1);
        await this.httpService.axiosRef.get('http://camera-checker:3000/check').then(res => {
            this.numberOfSuccessOutputRequestGauge.inc(1)
            if (res.data) {
                this.logger.log("fraudulent car detected: " + licensePlate);
                this.sendTicket(licensePlate);
            }
        }).catch(err => {
            this.logger.error("Cannot contact the camera-checker service")
            this.numberOfFailedOutputRequestGauge.inc(1)
        });

    }

    public sendTicket(licensePlate: string) {
        this.numberOfOutputRequestGauge.inc(1);
        this.httpService.axiosRef.post('http://billing-handler:3000/add-ticket/' + licensePlate, { price: 5 }).then(res => {
            this.logger.log("ticket sent to " + licensePlate);
            this.numberOfSuccessOutputRequestGauge.inc(1)
        }).catch(err => {
            this.numberOfFailedOutputRequestGauge.inc(1);
            this.logger.error("error sending ticket to " + licensePlate);
        });
    }

}
