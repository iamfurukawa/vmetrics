"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { DialogProject } from "@/components/app/dialog-project";

import ProjectService from "@/lib/project/project.service";

export interface SignOutProps {
  isOpened: boolean;
  setOpened: Function;
}

export function DialogSignOut({ isOpened, setOpened }: SignOutProps) {
  const activeProject = ProjectService.getActive();
  const [isDialogProjectOpened, setDialogProjectOpened] = useState(false);

  return (
    <>
      <DialogProject isOpened={isDialogProjectOpened} setOpened={setDialogProjectOpened}/>
      <Dialog open={isOpened} onOpenChange={setOpened}>
        <DialogContent onInteractOutside={(e: any) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Which project?</DialogTitle>
            <DialogDescription>
              <div className="space-y-6">
                <Select
                  onValueChange={(uuid: string) => {
                    ProjectService.setActiveBy(uuid);
                    setOpened(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={activeProject?.name}
                      defaultValue={activeProject?.uuid}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {ProjectService.getAll().map((project) => (
                      <SelectItem key={project.uuid} value={project.uuid}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={() => {
                    setOpened(false);
                    setDialogProjectOpened(true);
                  }}
                >
                  Add a new project
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
