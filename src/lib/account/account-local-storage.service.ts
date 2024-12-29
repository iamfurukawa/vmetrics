import { LocalStorage } from "../local-storage/local-storage.interface";
import { LocalStorageKeys } from "../local-storage/local-storage.keys";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { Project } from "./project.interface";

export class AccountLocalStorageService implements LocalStorage<string> {

    localStorageService: LocalStorageService<string>;
    
    constructor() { 
        this.localStorageService = new LocalStorageService<string>();
    }

    save(value: string): void {
        this.localStorageService.save(LocalStorageKeys.ACCOUNT_ID, value);
    }
    
    get(): string | null | undefined {
        return this.localStorageService.get(LocalStorageKeys.ACCOUNT_ID);
    }

    clear(): void {
        this.localStorageService.clear(LocalStorageKeys.ACCOUNT_ID);
    }
}
