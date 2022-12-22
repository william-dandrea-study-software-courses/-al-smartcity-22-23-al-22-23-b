import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import { Cache } from 'cache-manager';


@Injectable()
export class CacheServiceLicensePlate {

    private usersConnected = {};

    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    public async setNewId(licensePlate: string, id: string): Promise<void> {
        // this.usersConnected[licensePlate] = id;
        await this.cacheManager.set(licensePlate, id);
        return;
    }

    public async getIdOfLicensePlate(licensePlate: string): Promise<string | null> {
        return await this.cacheManager.get(licensePlate);
        // return this.usersConnected[licensePlate]
    }

    public async debug() {
        // console.log(this.cacheManager.)
        console.log(this.cacheManager.get('tst'))
    }
}
