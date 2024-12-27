"use client";
import { useEffect, useState } from "react";
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

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { AlertConfirmAction } from "../alert-confirm-action/index";

import { toast } from "@/hooks/use-toast";

import { Project } from "@/lib/project/project.interface";

import ProjectService from "@/lib/project/project.service";

export interface ProjectProps {
  isOpened: boolean;
  setOpened: Function;
  project?: Project;
}

export function DialogProject({ isOpened, setOpened, project }: ProjectProps) {

  const [isOpenedConfirmAction, setIsOpenedConfirmAction] = useState(false);

  const FormSchema = z.object({
    projectName: z
      .string()
      .trim()
      .nonempty({ message: "Project name cannot be empty." }),
    jiraApiKey: z
      .string()
      .trim()
      .nonempty({ message: "API Key cannot be empty." }),
    jiraUrl: z
      .string()
      .trim()
      .url({ message: "Jira URL must be a valid URL." }),
    email: z.string().trim().email({ message: "Invalid email address." }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    form.reset({
      projectName: project?.name || "",
      jiraApiKey: project?.jira?.apiKey || "",
      jiraUrl: project ? `https://${project.jira.url}` : "",
      email: project?.email || "",
    });
  }, [project, form]);

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

    if (project) {
      ProjectService.updateBy(project.uuid!, projectForm);
    } else {
      ProjectService.create(projectForm);
    }

    toast({
      description: `Project ${
        project ? `${project.name} updated` : `${projectForm.name} created`
      } successfully`,
    });

    setOpened(false);
  }

  function onDelete(shouldDelete: boolean) {
    if (!shouldDelete) return;
    
    ProjectService.deleteBy(project!.uuid!);
    const allProjects = ProjectService.getAll();

    if (allProjects.length === 0) {
      form.reset();
      return;
    }

    toast({
      description: `Project deleted successfully`,
    });

    setOpened(false);
  }

  return (
    <>
      <AlertConfirmAction isOpened={isOpenedConfirmAction} setOpened={setIsOpenedConfirmAction} confirmAction={onDelete} />
      <Dialog open={isOpened} onOpenChange={setOpened} disableOutsideClick>
        <DialogContent onInteractOutside={(e: any) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {project ? "Edit" : "Create"} a new project
            </DialogTitle>
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
                          <Input
                            placeholder="E.g. email@email.com"
                            {...field}
                          />
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
                        onClick={() => setIsOpenedConfirmAction(true)}
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
    </>
  );
}
