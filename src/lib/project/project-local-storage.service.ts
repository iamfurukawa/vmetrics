import { LocalStorage } from "@/lib/local-storage/local-storage.interface";
import { LocalStorageKeys } from "@/lib/local-storage/local-storage.keys";
import { LocalStorageService } from "@/lib/local-storage/local-storage.service";
import { Project } from "./project.interface";

export class ProjectLocalStorageService implements LocalStorage<Project[]> {

    localStorageService: LocalStorageService<Project[]>;
    
    constructor() { 
        this.localStorageService = new LocalStorageService<Project[]>();
    }

    save(value: Project[]): void {
        this.localStorageService.save(LocalStorageKeys.PROJECT, value);
    }
    
    get(): Project[] | null | undefined {
        return this.localStorageService.get(LocalStorageKeys.PROJECT);
    }

    clear(): void {
        this.localStorageService.clear(LocalStorageKeys.PROJECT);
    }
}
