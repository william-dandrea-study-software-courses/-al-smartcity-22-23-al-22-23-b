import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import { Cache } from 'cache-manager';


@Injectable()
export class CacheServiceLicensePlate {

    private usersConnected = {};

    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    public async setNewId(licensePlate: string, id: string): Promise<any> {
        // this.usersConnected[licensePlate] = id;
        return await this.cacheManager.store.set<{id: string}>(licensePlate, {id})

        // return await this.cacheManager.set(licensePlate, {id});
    }

    public async getIdOfLicensePlate(licensePlate: string): Promise<string | null> {
        const result: {id: string} | null = await this.cacheManager.store.get<{id: string}>(licensePlate);
        return result.id || null;
    }


    public async debug() {
        // console.log(this.cacheManager.)
        const r: string  = await this.getIdOfLicensePlate("DA444");
        console.log(r)

    }
}
