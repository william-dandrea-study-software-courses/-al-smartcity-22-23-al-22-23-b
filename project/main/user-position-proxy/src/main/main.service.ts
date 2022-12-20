import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from "@nestjs/microservices";
import { NewCarPositionDto } from './dto/new-car-position.dto';


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    constructor(
        @Inject('USER_POSITION_BUS') private readonly kafkaClient: ClientKafka,
    ) { }

    public get isConnected(): boolean {
        return true;
    }

    public async getHello(): Promise<string> {
        await this.kafkaClient.emit(
            'position_pattern',
            'salut toi'
        );

        return "Hello World"
    }

    public async sendPosition(data: NewCarPositionDto): Promise<string> {
        await this.kafkaClient.emit(
            'car-position',
            data
        );

        return "Position sent"
    }

    public async sendStart(data: NewCarPositionDto): Promise<string> {
        await this.kafkaClient.emit(
            'car-start',
            data
        );

        return "Start sent"
    }

    public async sendStop(data: NewCarPositionDto): Promise<string> {
        await this.kafkaClient.emit(
            'car-stop',
            data
        );

        return "Stop sent"
    }

}
