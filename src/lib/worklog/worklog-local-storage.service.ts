import { LocalStorage } from "../local-storage/local-storage.interface";
import { LocalStorageKeys } from "../local-storage/local-storage.keys";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { DailyWorklog } from "./worklog.interface";

export class WorklogLocalStorageService implements LocalStorage<DailyWorklog> {

    localStorageService: LocalStorageService<DailyWorklog>;
    
    constructor() { 
        this.localStorageService = new LocalStorageService<DailyWorklog>();
    }

    save(value: DailyWorklog): void {
        this.localStorageService.save(LocalStorageKeys.DAILY_WORKLOG, value);
    }
    
    get(): DailyWorklog | null | undefined {
        return this.localStorageService.get(LocalStorageKeys.DAILY_WORKLOG);
    }
}
