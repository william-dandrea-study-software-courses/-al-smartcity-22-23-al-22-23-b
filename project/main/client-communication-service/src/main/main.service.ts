import {Inject, Injectable, Logger} from '@nestjs/common';
import {NewFrequencyDto} from "./dto/new-frequency.dto";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    public get isConnected(): boolean {
        return true;
    }

    public getHello(): string {
        return "Hello World"
    }

    public async newCarFrequency(body: NewFrequencyDto) {
        this.logger.log(body);
    }
}
