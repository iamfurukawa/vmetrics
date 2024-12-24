"use client";
import { useState } from "react";

import { Cloud, Settings, ChevronUp, Briefcase, LogOut } from "lucide-react";

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
} from "./ui/dropdown-menu";

import { ProjectLocalStorageService } from "@/lib/project/project-local-storage.service";
import { DialogProject } from "./dialog-project";
import { DialogSignOut } from "./dialog-sign-out";

// Menu items.
const items = [
  {
    title: "Jira Sync",
    url: "#",
    icon: Cloud,
  },
];

export function AppSidebar() {
  const [isDialogProjectOpened, setDialogProjectOpened] = useState(false);
  const [isDialogSignOutOpened, setDialogSignOutOpened] = useState(false);

  const projectLocalStorageService = new ProjectLocalStorageService();
  const allProjects = projectLocalStorageService.get() || [];
  const activeProject = allProjects.find((p) => p.isActive);

  function onSettings() {
    setDialogProjectOpened(true);
  }

  function onLogOut() {
    setDialogSignOutOpened(true);
  }

  return (
    <>
    <DialogProject isOpened={isDialogProjectOpened} setOpened={setDialogProjectOpened} project={activeProject}/>
    <DialogSignOut isOpened={isDialogSignOutOpened} setOpened={setDialogSignOutOpened}/>
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actions {activeProject ? `for ${activeProject.name}` : ""}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                <DropdownMenuItem onClick={() => onSettings()}>
                  <Settings />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLogOut()}>
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
