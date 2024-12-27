"use client";
import { useEffect, useState } from "react";

import { format, add, sub } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

import { 
	MoreHorizontal, 
	CirclePlus, 
	ChevronLeft, 
	ChevronRight, 
	CalendarIcon, 
	Copy, 
	Trash, 
	Pencil, 
	StepForward, 
	Pause 
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { 
	DropdownMenu, 
	DropdownMenuContent, 
	DropdownMenuItem, 
	DropdownMenuLabel, 
	DropdownMenuSeparator, 
	DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import { DialogProject } from "@/components/app/dialog-project";

import { DialogWorklog } from "@/components/app/dialog-worklog";

import { DialogSelectDate } from "@/components/app/dialog-select-date";

import { AlertConfirmAction } from "@/components/app/alert-confirm-action";


import { Worklog, WorklogStatus } from "@/lib/worklog/worklog.interface";
import { Project } from "@/lib/project/project.interface";

import ProjectService from "@/lib/project/project.service";
import WorklogService from "@/lib/worklog/worklog.service";
import DateTimeService from "@/lib/date-time/date-time.service";

export default function Home() {

  const [activeProject, setActiveProject] = useState<Project | null>(ProjectService.getActive());
  const [worklogs, setWorklogs] = useState<Worklog[] | []>([]);
  const [currentWorklog, setCurrentWorklog] = useState<Worklog | null>(null);

  const [isAlertConfirmationOpened, setAlertConfirmationOpened] = useState(false);
  const [isDialogSelectDateOpened, setDialogSelectDateOpened] = useState(false);
  const [isDialogProjectOpened, setDialogProjectOpened] = useState(false);
  const [isDialogWorklogOpened, setDialogWorklogOpened] = useState(false);

  const [actualDate, setActualDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
	if (!activeProject) setDialogProjectOpened(true);
  }, []);

  useEffect(() => {
	  loadWorklogs();
  }, [actualDate, isAlertConfirmationOpened, isDialogSelectDateOpened, isDialogWorklogOpened, isDialogProjectOpened]);

  const loadWorklogs = () => setWorklogs(WorklogService.getAllBy(format(actualDate, "dd/MM/yyyy")));

  function total() {
	const worklogsDeltas = worklogs
		.filter((worklog) => worklog.date.end)
		.map((worklog) => DateTimeService.timeDelta(worklog.date.start, worklog.date.end!));

	return DateTimeService.timeSum(worklogsDeltas);
  }

  function continueOn(worklog: Worklog, date: string) {
	cloneTo({
		description: worklog.description,
		ticket: worklog.ticket,
		date: {
			start: format(new Date(), "HH:mm"),
		}
	}, date);
  }

  function stop(worklog: Worklog) {
	WorklogService.stopAt(format(actualDate, "dd/MM/yyyy"), worklog.uuid!);
	loadWorklogs();
  }

  function remove(worklog: Worklog, isConfirmed: boolean) {
	if(!isConfirmed) return;

	const date = format(actualDate, "dd/MM/yyyy");
	WorklogService.deleteBy(date, worklog.uuid!);
	
	toast({
		title: `Worklog removed successfully`,
		description: `[${date}] - ${worklog.description}`,
	});

	loadWorklogs();
  }

  function cloneTo(worklog: Worklog, date: string) {
	WorklogService.create(worklog, date);

	toast({
		title: `Worklog created successfully`,
		description: `[${date}] - ${worklog.description}`,
	});

	loadWorklogs();
  }

  return (
	<>
	  <AlertConfirmAction isOpened={isAlertConfirmationOpened} setOpened={setAlertConfirmationOpened} confirmAction={(isConfirmed: boolean) => remove(currentWorklog!, isConfirmed)}/>
	  <DialogSelectDate isOpened={isDialogSelectDateOpened} setOpened={setDialogSelectDateOpened} setSelectedDate={(date: string) => cloneTo(currentWorklog!, date)}/>
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
			  {worklogs
			  	.sort(DateTimeService.timeSort)
			  	.map((worklog) => (
				<TableRow key={worklog.uuid}>
				  <TableCell className="font-medium">{`${worklog.ticket} - ${worklog.description}`}</TableCell>
				  <TableCell className="font-medium"> {" "} <Badge variant={ worklog.status === WorklogStatus.PENDING ? "destructive" : "default" }> {worklog.status} </Badge>{" "} </TableCell>
				  <TableCell className="font-medium">{`${worklog.date.start}h ${worklog.date.end ? ` - ${worklog.date.end}h (${DateTimeService.timeDelta(worklog.date.start, worklog.date.end)}h)` : "" }`}</TableCell>
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
						{ format(new Date(), "dd/MM/yyyy") !== format(actualDate, "dd/MM/yyyy") &&
							<DropdownMenuItem onClick={() => continueOn(worklog, format(actualDate, "dd/MM/yyyy"))} >
								<StepForward/> Continue task {format(actualDate, "dd/MM/yyyy")} 
							</DropdownMenuItem>
						}
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
