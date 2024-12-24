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
import { Worklog } from "@/lib/worklog/worklog.interface";
import { WorklogLocalStorageService } from "@/lib/worklog/worklog-local-storage.service";

export interface WorklogProps {
  isOpened: any;
  setOpened: any;
  worklog?: Worklog;
}

const FormSchema = z.object({
  description: z
    .string()
    .trim()
    .nonempty({ message: "Description cannot be empty." }),
  ticket: z.string().trim().nonempty({ message: "Ticket cannot be empty." }),
  start: z.string({ message: "Start time cannot be empty." }),
  end: z.string({ message: "End time cannot be empty." }),
});

export function DialogWorklog({ isOpened, setOpened, worklog }: WorklogProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: worklog ? worklog.description : "",
      ticket: worklog ? worklog.ticket : "",
      start: worklog ? worklog.date.start : "",
      end: worklog ? worklog.date.end : "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    let worklogForm: Worklog = {
      description: data.description,
      ticket: data.ticket,
      date: {
        start: data.start,
        end: data.end,
      },
    };

    toast({
      description: `Worklog ${
        worklogForm ? "updated" : "created"
      } successfully`,
    });

    setOpened(false);
  }

  function onDelete() {
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
    <Dialog open={isOpened} onOpenChange={setOpened} disableOutsideClick>
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
                          <Input
                            placeholder="E.g. COREP-1234"
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
