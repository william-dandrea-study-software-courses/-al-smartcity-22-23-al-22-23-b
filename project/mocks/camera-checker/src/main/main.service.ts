import { Inject, Injectable, Logger } from '@nestjs/common';


@Injectable()
export class MainService {

    private readonly logger = new Logger(MainService.name);

    public get isConnected(): boolean {
        return true;
    }

    public checkCamera(): boolean {
        this.logger.log("checking camera");
        const res = Math.round(Math.random() * 10) == 1;
        this.logger.log(res ? "fraud" : "not fraud");

        return res;
    }

}
