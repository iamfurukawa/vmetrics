import { LocalStorage } from "../local-storage/local-storage.interface";
import { LocalStorageKeys } from "../local-storage/local-storage.keys";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { Worklog } from "./worklog.interface";

export class WorklogLocalStorageService implements LocalStorage<Worklog[]> {

    localStorageService: LocalStorageService<Worklog[]>;
    
    constructor() { 
        this.localStorageService = new LocalStorageService<Worklog[]>();
    }

    save(value: Worklog[]): void {
        this.localStorageService.save(LocalStorageKeys.WORKLOG, value);
    }
    get(): Worklog[] | null | undefined {
        return this.localStorageService.get(LocalStorageKeys.WORKLOG);
    }
}
