import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly logger;
    constructor(appService: AppService);
    getHello(): string;
    handleCarShutdown(data: Record<string, string>): Promise<void>;
    handleCarPosition(data: Record<string, string>): Promise<void>;
}
