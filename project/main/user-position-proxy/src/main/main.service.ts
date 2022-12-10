import {Inject, Injectable, Logger} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    constructor(
        @Inject('USER_POSITION_BUS') private readonly kafkaClient: ClientKafka,
    ) {}

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

}
