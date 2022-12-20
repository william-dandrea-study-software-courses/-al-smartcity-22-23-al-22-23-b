import {Inject, Injectable, Logger} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";


@Injectable()
export class MainService {
    private readonly logger = new Logger(MainService.name);

    @EventPattern('position_pattern')
    public receiveNewPosition(data: any) {
        console.log(data);
    }

    public get isConnected(): boolean {
        return true;
    }

    public getHello(): string {
        return "Hello World"
    }

}
