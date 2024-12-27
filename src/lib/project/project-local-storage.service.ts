import { LocalStorage } from "../local-storage/local-storage.interface";
import { LocalStorageKeys } from "../local-storage/local-storage.keys";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { Project } from "./project.interface";
import { v4 as uuidv4 } from 'uuid';


export class ProjectLocalStorageService implements LocalStorage<Project[]> {

    localStorageService: LocalStorageService<Project[]>;
    
    constructor() { 
        this.localStorageService = new LocalStorageService<Project[]>();
    }

    save(value: Project[]): void {
        value = value.map(p => ({ ...p, uuid: p.uuid ?? uuidv4() }));
        this.localStorageService.save(LocalStorageKeys.PROJECT, value);
    }
    
    get(): Project[] | null | undefined {
        return this.localStorageService.get(LocalStorageKeys.PROJECT);
    }
}
