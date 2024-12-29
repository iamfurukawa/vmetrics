import { v4 as uuidv4 } from "uuid";

import { ProjectLocalStorageService } from "@/lib/project/project-local-storage.service";
import { AccountLocalStorageService } from "@/lib/account/account-local-storage.service";
import { Project } from "@/lib/project/project.interface";

class ProjectService {
  projectRepository: ProjectLocalStorageService;
  accountRepository: AccountLocalStorageService;

  constructor() {
    this.projectRepository = new ProjectLocalStorageService();
    this.accountRepository = new AccountLocalStorageService();
  }

  getAll(): Project[] {
    return this.projectRepository.get() || [];
  }

  getActive(): Project | null {
    const allProjects = this.projectRepository.get() || [];
    return allProjects.find((project) => project.isActive) || null;
  }

  setActiveBy(uuid: string): void {
    let allProjects = this.projectRepository.get() || [];
    allProjects = allProjects.map((project) => ({
      ...project,
      isActive: project.uuid === uuid,
    }));
    this.projectRepository.save(allProjects);
    this.accountRepository.clear();
  }

  updateBy(uuid: string, project: Project): void {
    let allProjects = this.projectRepository.get() || [];
    allProjects = allProjects.filter((p) => p.uuid !== uuid);
    allProjects = allProjects.map((p) => ({ ...p, isActive: false }));
    project = { ...project, uuid: uuid, isActive: true };
    this.projectRepository.save([...allProjects, project]);
    this.accountRepository.clear();
  }

  create(project: Project): void {
    let allProjects = this.projectRepository.get() || [];
    allProjects = allProjects.map((p) => ({ ...p, isActive: false }));
    project = { ...project, uuid: uuidv4(), isActive: true };
    this.projectRepository.save([...allProjects, project]);
    this.accountRepository.clear();
    window.location.reload();
  }

  deleteBy(uuid: string): void {
    let allProjects = this.projectRepository.get() || [];
    allProjects = allProjects.filter((p) => p.uuid !== uuid);
    if(allProjects.length > 0)
      allProjects[0].isActive = true;
    this.projectRepository.save(allProjects);
  }
}

export default new ProjectService();
