"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { toast } from "@/hooks/use-toast";
import { Worklog, WorklogStatus } from "@/lib/worklog/worklog.interface";
import { WorklogLocalStorageService } from "@/lib/worklog/worklog-local-storage.service";
import { useEffect } from "react";

export interface WorklogProps {
  isOpened: any;
  setOpened: any;
  worklog?: Worklog;
  date: string;
}

export function DialogWorklog({
  isOpened,
  setOpened,
  worklog,
  date,
}: WorklogProps) {
  const worklogLocalStorageService = new WorklogLocalStorageService();

  const FormSchema = z.object({
    description: z
      .string()
      .trim()
      .nonempty({ message: "Description cannot be empty." }),
    ticket: z
      .string()
      .trim(),
    start: z.string().trim(),
    end: z.string().trim(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  useEffect(() => {
    form.reset({
      description: worklog?.description || "",
      ticket: worklog?.ticket || "",
      start: worklog?.date?.start || "",
      end: worklog?.date?.end || "",
    });
  }, [worklog, form]);


  function onSubmit(data: z.infer<typeof FormSchema>) {
    let worklogForm: Worklog = {
      uuid: uuidv4(),
      description: data.description,
      ticket: data.ticket,
      status: WorklogStatus.PENDING,
      date: {
        start: data.start,
        end: data.end,
      },
    };

    const worklogs = worklogLocalStorageService.get() || {};
    if (worklogs.hasOwnProperty(date)) {
      worklogs[date] = [...worklogs[date], worklogForm];
    } else {
      worklogs[date] = [worklogForm];
    }
    worklogLocalStorageService.save(worklogs);

    toast({
      description: `Worklog ${worklog ? "updated" : "created"} successfully`,
    });

    setOpened(false);
  }

  const handleInputTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (value.length >= 3) value = `${value.slice(0, 2)}:${value.slice(2, 4)}`; // Adiciona o `:`
    form.setValue(e.target.name, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Dialog open={isOpened} onOpenChange={setOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{worklog ? "Edit" : "Create"} a worklog</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Create a new bug in production"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <FormField
                    control={form.control}
                    name="ticket"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g. COREP-1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Started at</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="HH:MM"
                            {...field}
                            onChange={handleInputTimeChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ended at</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="HH:MM"
                            {...field}
                            onChange={handleInputTimeChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit">Save</Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
