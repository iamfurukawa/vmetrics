"use client";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { format, add, sub } from "date-fns";
import { v4 as uuidv4 } from 'uuid';

import { DialogProject } from "@/components/dialog-project";
import { DialogWorklog } from "@/components/dialog-worklog";
import { DialogSelectDate } from "@/components/app/dialog-select-date";

import { cn } from "@/lib/utils";
import { Worklog, WorklogStatus } from "@/lib/worklog/worklog.interface";
import { Project } from "@/lib/project/project.interface";
import { ProjectLocalStorageService } from "@/lib/project/project-local-storage.service";
import { WorklogLocalStorageService } from "@/lib/worklog/worklog-local-storage.service";

import { MoreHorizontal, CirclePlus, ChevronLeft, ChevronRight, CalendarIcon, Copy, Trash, Pencil, StepForward, Pause } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AlertConfirmAction } from "@/components/app/alert-confirm-action";

export default function Home() {
  const projectLocalStorageService = new ProjectLocalStorageService();
  const worklogLocalStorageService = new WorklogLocalStorageService();

  const [projects, setProjects] = useState<Project[] | null | undefined>(null);
  const [worklogs, setWorklogs] = useState<Worklog[] | []>([]);
  const [currentWorklog, setCurrentWorklog] = useState<Worklog | null>(null);

  const [isAlertConfirmationOpened, setAlertConfirmationOpened] = useState(false);
  const [isDialogSelectDateOpened, setDialogSelectDateOpened] = useState(false);
  const [isDialogProjectOpened, setDialogProjectOpened] = useState(false);
  const [isDialogWorklogOpened, setDialogWorklogOpened] = useState(false);

  const [actualDate, setActualDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    setProjects(projectLocalStorageService.get() || []);
    if (projects?.length === 0) setDialogProjectOpened(true);
  }, []);

  useEffect(() => {
	loadWorklogData();
  }, [actualDate, isAlertConfirmationOpened, isDialogSelectDateOpened, isDialogWorklogOpened, isDialogProjectOpened]);

  function loadWorklogData() {
	const date = format(actualDate, "dd/MM/yyyy");
	const worklogsStoraged = worklogLocalStorageService.get() || {};
	setWorklogs(worklogsStoraged[date] || []);
  }

  function timeDelta(hora1: string, hora2: string): string {
    // Converter horas e minutos de strings para números
    const [h1, m1] = hora1.split(":").map(Number);
    const [h2, m2] = hora2.split(":").map(Number);

    // Transformar tudo em minutos
    const minutos1 = h1 * 60 + m1;
    const minutos2 = h2 * 60 + m2;

    // Calcular a diferença em minutos
    const diferencaMinutos = Math.abs(minutos2 - minutos1);

    // Converter de volta para horas e minutos
    const horas = Math.floor(diferencaMinutos / 60);
    const minutos = diferencaMinutos % 60;

    // Retornar no formato HH:mm
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
      2,
      "0"
    )}`;
  }

  function timeSum(listaDeTempos: string[]): string {
    let totalMinutos = 0;

    // Somar todos os tempos em minutos
    listaDeTempos.forEach((tempo) => {
      const [horas, minutos] = tempo.split(":").map(Number);
      totalMinutos += horas * 60 + minutos;
    });

    // Converter o total de minutos para horas e minutos
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    // Retornar no formato HH:mm
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
      2,
      "0"
    )}`;
  }

  function total() {
    const worklogsEnded = worklogs.filter((worklog) => worklog.date.end);
    const worklogsDeltas = worklogsEnded.map((worklog) =>
      timeDelta(worklog.date.start, worklog.date.end!)
    );
    return timeSum(worklogsDeltas);
  }

  function continueOn(worklog: Worklog, date: string) {
	worklog.date.start = format(new Date(), "HH:mm");
	worklog.date.end = undefined;
	worklog.status = WorklogStatus.PENDING;
	worklog.uuid = uuidv4();

	const worklogs = worklogLocalStorageService.get() || {};
    if(worklogs.hasOwnProperty(date)) {
      worklogs[date] = [...worklogs[date], worklog];  
    } else {
      worklogs[date] = [worklog];
    }
    worklogLocalStorageService.save(worklogs);

    toast({
      description: `Worklog created successfully`,
    });

	loadWorklogData();
  }

  function stop(worklog: Worklog) {
	const date = format(actualDate, "dd/MM/yyyy");

	let worklogs = worklogLocalStorageService.get() || {};
	worklogs[date] = worklogs[date].map((w) => {
		if (w.uuid === worklog.uuid) {
			worklog.date.end = format(new Date(), "HH:mm");
			worklog.status = WorklogStatus.PENDING;
			return worklog;
		}
		return w;
	});
	
	toast({
		description: `Worklog stopped successfully`,
	});

	worklogLocalStorageService.save(worklogs);
	loadWorklogData();
  }

  function remove(worklog: Worklog, isConfirmed: boolean) {
	if(!isConfirmed) return;

	const date = format(actualDate, "dd/MM/yyyy");

	let worklogs = worklogLocalStorageService.get() || {};
	worklogs[date] = worklogs[date].filter((w) => w.uuid !== worklog.uuid);
	
	toast({
		description: `Worklog removed successfully`,
	});

	worklogLocalStorageService.save(worklogs);
	loadWorklogData();
  }

  function cloneTo(worklog: Worklog, date: string) {
	let worklogs = worklogLocalStorageService.get() || {};
	worklog.uuid = uuidv4();
	if(worklogs.hasOwnProperty(date)) {
		worklogs[date] = [...worklogs[date], worklog];  
	  } else {
		worklogs[date] = [worklog];
	  }
	  worklogLocalStorageService.save(worklogs);

	toast({
		description: `Worklog cloned successfully`,
	});

	loadWorklogData();
  }

  return (
    <>
	  <AlertConfirmAction isOpened={isAlertConfirmationOpened} setOpened={setAlertConfirmationOpened} confirmAction={(isConfirmed: boolean) => remove(currentWorklog, isConfirmed)}/>
	  <DialogSelectDate isOpened={isDialogSelectDateOpened} setOpened={setDialogSelectDateOpened} setSelectedDate={(date: string) => cloneTo(currentWorklog, date)}/>
	  <DialogWorklog isOpened={isDialogWorklogOpened} setOpened={setDialogWorklogOpened} date={format(actualDate, "dd/MM/yyyy")} worklog={currentWorklog}/>
      <DialogProject isOpened={isDialogProjectOpened} setOpened={setDialogProjectOpened} />
      <div>
	  	<div className="flex justify-between items-center h-[100px]">
			<CirclePlus size={30} style={{"cursor": "pointer"}} onClick={() => {
					setCurrentWorklog(null);
					setDialogWorklogOpened(true);
				}}/>
			<div className="flex items-center">
				<ChevronLeft style={{"cursor": "pointer"}} onClick={() => setActualDate(sub(actualDate, { days: 1 }))}/>
				<Popover>
                <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !actualDate && "text-muted-foreground"
                      )}
                    >
                      {actualDate ? (
						format(actualDate, "dd/MMM/yyyy - EEEE")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={actualDate}
                    onSelect={(date: Date) => setActualDate(date || new Date())}
                    disabled={(date: Date) =>
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
			  <ChevronRight style={{"cursor": "pointer"}} onClick={() => setActualDate(add(actualDate, { days: 1 }))}/>
			</div>
		</div>
        <div className="flex w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Was Synced</TableHead>
                <TableHead>Time</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {worklogs.map((worklog) => (
                <TableRow key={worklog.uuid}>
                  <TableCell className="font-medium">{`${worklog.ticket} - ${worklog.description}`}</TableCell>
                  <TableCell className="font-medium"> {" "} <Badge variant={ worklog.status === WorklogStatus.PENDING ? "destructive" : "default" }> {worklog.status} </Badge>{" "} </TableCell>
                  <TableCell className="font-medium">{`${worklog.date.start}h ${worklog.date.end ? ` - ${worklog.date.end}h (${timeDelta(worklog.date.start, worklog.date.end)}h)` : "" }`}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => continueOn(worklog, format(new Date(), "dd/MM/yyyy"))} >
						  <StepForward/> Continue task {format(new Date(), "dd/MM/yyyy")}
                        </DropdownMenuItem>
						<DropdownMenuItem onClick={() => continueOn(worklog, format(actualDate, "dd/MM/yyyy"))} >
							<StepForward/> Continue task {format(actualDate, "dd/MM/yyyy")} 
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => stop(worklog)} >
							<Pause/> Stop task 
						</DropdownMenuItem>
						<DropdownMenuSeparator/>
						<DropdownMenuItem onClick={() => {
							setCurrentWorklog(worklog);
							setDialogWorklogOpened(true);
						}} >
							<Pencil/> Edit 
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => {
							setCurrentWorklog(worklog);
							setAlertConfirmationOpened(true);
						}} >
							<Trash/> Delete 
						</DropdownMenuItem>
						<DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => {
							setCurrentWorklog(worklog);
							setDialogSelectDateOpened(true);
						}} >
							<Copy/> Clone to 
						</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell colSpan={2}>{total()}h</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </>
  );
}
