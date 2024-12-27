"use client";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ProjectLocalStorageService } from "@/lib/project/project-local-storage.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { DialogProject } from "./dialog-project";

export interface SignOutProps {
  isOpened: any;
  setOpened: any;
}

export function DialogSignOut({ isOpened, setOpened }: SignOutProps) {
  const projectLocalStorageService = new ProjectLocalStorageService();
  let allProjects = projectLocalStorageService.get() || [];
  const activeProject = allProjects.find((p) => p.isActive);
  
  const [isDialogProjectOpened, setDialogProjectOpened] = useState(false);

  function onSelectProject(projectChoosed: string){
    allProjects = allProjects.map((p) => ({ ...p, isActive: p.uuid === projectChoosed }));
    projectLocalStorageService.save(allProjects);
    setOpened(false);
  }

  function onAddProject() {
    setOpened(false);
    setDialogProjectOpened(true);
  }

  return (
    <>
      <DialogProject
        isOpened={isDialogProjectOpened}
        setOpened={setDialogProjectOpened}
      />
      <Dialog open={isOpened} onOpenChange={setOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Which project?</DialogTitle>
            <DialogDescription>
              <div className="space-y-6">
                <Select onValueChange={onSelectProject}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={activeProject?.name}
                      defaultValue={activeProject?.uuid}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {allProjects.map((p) => (
                      <SelectItem key={p.uuid} value={p.uuid} >
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={() => onAddProject()}>
                  Add a new Project
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
