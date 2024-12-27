"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { toast } from "@/hooks/use-toast";
import { Project } from "@/lib/project/project.interface";
import { ProjectLocalStorageService } from "@/lib/project/project-local-storage.service";

export interface ProjectProps {
  isOpened: any;
  setOpened: any;
  project?: Project;
}

export function DialogProject({ isOpened, setOpened, project }: ProjectProps) {
  const projectLocalStorageService = new ProjectLocalStorageService();

  const FormSchema = z.object({
    projectName: z
      .string()
      .trim()
      .nonempty({ message: "Project name cannot be empty." }),
    jiraApiKey: z
      .string()
      .trim()
      .nonempty({ message: "API Key cannot be empty." }),
    jiraUrl: z.string().trim().url({ message: "Jira URL must be a valid URL." }),
    email: z.string().trim().email({ message: "Invalid email address." }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectName: project ? project.name : "",
      jiraApiKey: project ? project.jira.apiKey : "",
      jiraUrl: project ? `https://${project.jira.url}` : "",
      email: project ? project.email : "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    let projectForm: Project = {
      isActive: true,
      name: data.projectName,
      email: data.email,
      jira: {
        url: data.jiraUrl.replace("https://", "").replace("http://", ""),
        apiKey: data.jiraApiKey,
      },
    };

    let actualProjects = projectLocalStorageService.get() || [];

    if (project) {
      actualProjects = actualProjects.filter((p) => p.uuid !== project.uuid);
      projectForm = { ...projectForm, uuid: project.uuid };
    }

    actualProjects = actualProjects.map((p) => ({ ...p, isActive: false }));

    projectLocalStorageService.save([...actualProjects, projectForm]);

    toast({
      description: `Project ${project ? "updated" : "created"} successfully`,
    });

    setOpened(false);
  }

  function onDelete() {
    let actualProjects = projectLocalStorageService.get();

    actualProjects = actualProjects!.filter((p) => p.uuid !== project!.uuid);
    actualProjects[0].isActive = true;

    projectLocalStorageService.save(actualProjects);
    
    if (actualProjects.length === 0) {
      form.reset();
      return;
    }

    toast({
      description: `Project deleted successfully`,
    });

    setOpened(false);
  }

  return (
    <Dialog open={isOpened} onOpenChange={setOpened} disableOutsideClick>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit" : "Create"} a new project</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Digio" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your project name (E.g. Digio, OOB, PagBem, etc).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jiraUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jira URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g. https://someone.atlassian.net"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Your jira URL board.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jiraApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jira API Key</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g. a4d8as9d4a94ds8a9sd4a9sas94d"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Get token here:
                        https://id.atlassian.com/manage-profile/security/api-tokens
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. email@email.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your email that you use for access Jira.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  {project && (
                    <Button
                      type="button"
                      onClick={() => onDelete()}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  )}

                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
