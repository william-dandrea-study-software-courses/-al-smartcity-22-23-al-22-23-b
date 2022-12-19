import {HttpException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {CarPosition, CarPositionDocument} from "./schema/car-position.schema";
import {Model} from "mongoose";
import {HttpService} from "@nestjs/axios";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    constructor(
        @InjectModel(CarPosition.name) private carPositionModel: Model<CarPositionDocument>,
        private readonly httpService: HttpService)
    {}

    getHello(): Promise<any> {
        return this.carPositionModel.find({}).exec();
    }

    public async onCarShutdownEvent(data: Record<string, unknown>): Promise<void> {
        const licensePlate: string | unknown = data.license_plate;
        const allCarPositions: CarPosition[] = await this.carPositionModel.find({license_plate: licensePlate});

        if (allCarPositions && licensePlate) {

            let price: number = 0;
            allCarPositions.forEach(carPosition => {
                if (carPosition.zone === "1") {
                    price += 50;
                } else if (carPosition.zone === "2") {
                    price += 40;
                } else if (carPosition.zone === "3") {
                    price += 30;
                } else if (carPosition.zone === "4") {
                    price += 10;
                } else {
                    price += 5;
                }
            })

            this.sendPositionsToNextServices(licensePlate, price, allCarPositions).then(async () => {
                await this.carPositionModel.deleteMany({license_plate: licensePlate})
            }, () => {
                throw new HttpException("Error during the send to the bill or tracking-shutdown", HttpStatus.UNPROCESSABLE_ENTITY)
            })
        } else {
            throw new HttpException("Cannot shutdown a car because the license_plate is not given", HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }

    public get isConnected(): boolean {
        return true;
    }


    private sendPositionsToNextServices(licensePlate: string | unknown, price: number, allCarPositions: CarPosition[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.httpService.post('http://billing-handler:3000/new-bill', {'license_plate': licensePlate, 'bill': price}).subscribe(result => {
                this.httpService.post('http://tracking-analytics:3000/new-analytics', {'license_plate': licensePlate, 'bill': price, 'positions': allCarPositions}).subscribe(r => {
                    resolve()
                }, error => {
                    this.logger.error(`Cannot send the bill to tracking-analytics`)
                    reject()
                })
            }, error => {
                this.logger.error(`Cannot send the bill to billing-handler`)
                reject()
            })
        });
    }
}
