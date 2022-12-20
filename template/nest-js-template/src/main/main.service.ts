import {Inject, Injectable, Logger} from '@nestjs/common';


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    public get isConnected(): boolean {
        return true;
    }

    public getHello(): string {
        return "Hello World"
    }

}
