import { ProjectLocalStorageService } from "./project-local-storage.service";
import { Project } from "@/lib/project/project.interface";
import { v4 as uuidv4 } from "uuid";

class ProjectService {
  projectRepository: ProjectLocalStorageService;

  constructor() {
    this.projectRepository = new ProjectLocalStorageService();
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
  }

  updateBy(uuid: string, project: Project): void {
    let allProjects = this.projectRepository.get() || [];
    allProjects = allProjects.filter((p) => p.uuid !== uuid);
    allProjects = allProjects.map((p) => ({ ...p, isActive: false }));
    project = { ...project, uuid: uuid, isActive: true };
    this.projectRepository.save([...allProjects, project]);
  }

  create(project: Project): void {
    let allProjects = this.projectRepository.get() || [];
    allProjects = allProjects.map((p) => ({ ...p, isActive: false }));
    project = { ...project, uuid: uuidv4(), isActive: true };
    this.projectRepository.save([...allProjects, project]);
    window.location.reload();
  }

  deleteBy(uuid: string): void {
    let allProjects = this.projectRepository.get() || [];
    allProjects = allProjects.filter((p) => p.uuid !== uuid);
    allProjects[0].isActive = true;
    this.projectRepository.save(allProjects);
  }
}

export default new ProjectService();
