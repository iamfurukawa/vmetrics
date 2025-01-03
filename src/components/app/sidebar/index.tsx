"use client";
import { useEffect, useState } from "react";

import { 
  CloudDownload, 
  Settings, 
  ChevronUp, 
  Briefcase, 
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "@/hooks/use-toast";

import { DialogProject } from "@/components/app/dialog-project";
import { DialogSignOut } from "@/components/app/dialog-sign-out";
import { AlertConfirmAction } from "@/components/app/alert-confirm-action/index";

import JiraService from "@/lib/jira/jira.service";
import ProjectService from "@/lib/project/project.service";
import { Project } from "@/lib/project/project.interface";
import WorklogService from "@/lib/worklog/worklog.service";

export function AppSidebar() {
  const [isDialogProjectOpened, setDialogProjectOpened] = useState(false);
  const [isDialogSignOutOpened, setDialogSignOutOpened] = useState(false);
  const [isAlertConfirmationOpened, setAlertConfirmationOpened] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(ProjectService.getActive());

  async function handleDownloadSync(isConfirmed: boolean) {
    if(!isConfirmed) return;
    await WorklogService.retrieveLastsTwoWeeksWorklogs();

    toast({
      title: `Worklog downloaded successfully!`,
    });
  }

  useEffect(() => {
    const activeProject = ProjectService.getActive()
    setActiveProject(activeProject);
    if(!activeProject)
      setDialogProjectOpened(true);

    const fetch = async () => {
      await JiraService.getMyUserId();
    }

    fetch();
  }, [isDialogProjectOpened, isDialogSignOutOpened]);

  return (
    <>
    <AlertConfirmAction isOpened={isAlertConfirmationOpened} setOpened={setAlertConfirmationOpened} confirmAction={handleDownloadSync} customMessage={'THIS WILL BE OVERWRITTEN ALL WORKLOGS!'}/>
    <DialogProject isOpened={isDialogProjectOpened} setOpened={setDialogProjectOpened} project={activeProject}/>
    <DialogSignOut isOpened={isDialogSignOutOpened} setOpened={setDialogSignOutOpened}/>
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actions {activeProject ? `for ${activeProject.name}` : ""}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
                <SidebarMenuItem key="jira-download">
                  <SidebarMenuButton asChild>
                    <a href={'#'} onClick={() => setAlertConfirmationOpened(true)}>
                      <CloudDownload />
                      <span>Jira Download</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Briefcase />  {activeProject ? activeProject.name : "Unknown project"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={() => setDialogProjectOpened(true)}>
                  <Settings />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDialogSignOutOpened(true)}>
                  <LogOut />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    </>
  );
}
