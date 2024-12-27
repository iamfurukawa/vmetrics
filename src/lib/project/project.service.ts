import { ProjectLocalStorageService } from "./project-local-storage.service";
import { Project } from "@/lib/project/project.interface";

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

  setActiveProject(uuid: string): void {
    let allProjects = this.projectRepository.get() || [];
    allProjects = allProjects.map((project) => ({
      ...project,
      isActive: project.uuid === uuid,
    }));
    this.projectRepository.save(allProjects);
  }
}

export default new ProjectService();