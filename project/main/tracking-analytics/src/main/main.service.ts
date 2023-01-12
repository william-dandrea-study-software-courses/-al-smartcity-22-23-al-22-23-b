import {Inject, Injectable, Logger} from '@nestjs/common';
import {NewAnalyticsDto} from "./dto/new-analytics.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Statistics, StatisticsDocument} from "./schema/statistics-schema.schema";
import {Model} from "mongoose";
import {PrometheusService} from "../prometheus/prometheus.service";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    private numberOfDatabaseCall = this.prometheusService.registerGauge("number_of_database_call", "number_of_database_call")

    constructor(
        @InjectModel(Statistics.name) private statisticsModel: Model<StatisticsDocument>,
        private prometheusService: PrometheusService
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

        this.numberOfDatabaseCall.inc(1);
        await this.statisticsModel.create(newStat);

        return {"status": "OK"};
    }
}
