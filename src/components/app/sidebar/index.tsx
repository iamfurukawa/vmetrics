"use client";
import { useState } from "react";

import { 
  Cloud, 
  Settings, 
  ChevronUp, 
  Briefcase, 
  LogOut 
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

import { DialogProject } from "@/components/app/dialog-project";
import { DialogSignOut } from "@/components/app/dialog-sign-out";

import ProjectService from "@/lib/project/project.service";

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
  const activeProject = ProjectService.getActive();

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
