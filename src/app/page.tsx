"use client";

import { DialogProject } from "@/components/dialog-project";
import { DialogWorklog } from "@/components/dialog-worklog";
import { Project } from "@/lib/project/project.interface";
import { useEffect, useState } from "react";
import { ProjectLocalStorageService } from "../lib/project/project-local-storage.service";

export default function Home() {
  const projectLocalStorageService = new ProjectLocalStorageService();

  const [projects, setProjects] = useState<Project[] | null | undefined>(null);
  const [isDialogProjectOpened, setDialogProjectOpened] = useState(false);
  const project = {
    isActive: true,
    uuid: "a7c0cc17-2c85-41e5-bddd-9e01f9ad19cc",
    name: "Project 1",
    email: "lK3XW@example.com",
    jira: {
      url: "jira.atlassian.com",
      apiKey: "123",
    },
  };

  useEffect(() => {
    setProjects(projectLocalStorageService.get() || []);
    if (projects?.length === 0) setDialogProjectOpened(true);
  }, []);

  return <DialogWorklog isOpened={true} setOpened={true}/>
    // return <DialogProject isOpened={isDialogProjectOpened} setOpened={setDialogProjectOpened} />
  // return <DialogNewProject isOpened={isDialogNewProjectOpened} setOpened={setDialogNewProjectOpened} project={project}/>;
}
