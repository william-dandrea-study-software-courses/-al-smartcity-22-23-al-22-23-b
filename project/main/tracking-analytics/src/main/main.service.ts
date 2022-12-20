import {Inject, Injectable, Logger} from '@nestjs/common';
import {NewAnalyticsDto} from "./dto/new-analytics.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Statistics, StatisticsDocument} from "./schema/statistics-schema.schema";
import {Model} from "mongoose";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    constructor(
        @InjectModel(Statistics.name) private statisticsModel: Model<StatisticsDocument>
    ) {}

    public get isConnected(): boolean {
        return true;
    }

    public getHello(): string {
        return "Hello World"
    }

    public async newAnalytics(newAnalytic: NewAnalyticsDto): Promise<any> {
        this.logger.log(newAnalytic)

        const newStat: Statistics = new Statistics();
        newStat.license_plate = newAnalytic.license_plate;
        newStat.bill = newAnalytic.bill;
        newStat.positions = newAnalytic.positions;

        await this.statisticsModel.create(newStat);

        return {"status": "OK"};
    }
}
