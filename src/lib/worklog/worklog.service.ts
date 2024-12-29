import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

import { WorklogLocalStorageService } from "./worklog-local-storage.service";
import { DailyWorklog, Worklog, WorklogStatus } from "./worklog.interface";
import JiraService from "@/lib/jira/jira.service";


class WorklogService {
  worklogRepository: WorklogLocalStorageService;

  constructor() {
    this.worklogRepository = new WorklogLocalStorageService();
  }

  getAllBy(date: string): Worklog[] {
      const worklogsStoraged = this.worklogRepository.get() || {};
      return worklogsStoraged[date] || []
  }

  create(worklog: Worklog, date: string) {
    const worklogs = this.worklogRepository.get() || {};

    worklog.uuid = uuidv4();
    worklog.status = worklog.status || WorklogStatus.PENDING;
    worklog.date.end = undefined;

    if (worklogs.hasOwnProperty(date)) {
      worklogs[date] = [...worklogs[date], worklog];
    } else {
      worklogs[date] = [worklog];
    }

    this.worklogRepository.save(worklogs);
  }

  updateBy(worklog: Worklog, date: string, uuid: string) {
    const worklogs = this.worklogRepository.get() || {};
    worklogs[date] = worklogs[date].map((w) => {
      if (w.uuid === uuid) {
        w.description = worklog.description;
        w.date.start = worklog.date.start;
        w.date.end = worklog.date.end;
        w.ticket = worklog.ticket;
        w.status = WorklogStatus.PENDING;
      }
      return w;
    });
    this.worklogRepository.save(worklogs);
  }

  deleteBy(date: string, uuid: string) {
    const worklogs = this.worklogRepository.get() || {};
    worklogs[date] = worklogs[date].filter((w) => w.uuid !== uuid);
    this.worklogRepository.save(worklogs);
  }

  stopAt(date: string, uuid: string) {
    const worklogs = this.worklogRepository.get() || {};
    worklogs[date] = worklogs[date].map((w) => {
      if (w.uuid === uuid) {
        w.date.end = format(new Date(), "HH:mm");
        w.status = WorklogStatus.PENDING;
      }
      return w;
    });
    this.worklogRepository.save(worklogs);
  }

  async retrieveLastsTwoWeeksWorklogs() {
    const worklogKeys = await JiraService.getMyLastsTwoWeeksWorklogs();
    const worklogDetails = await Promise.all(
      worklogKeys.map((key) => JiraService.getWorklogsBy(key))
    );

    const worklogs: DailyWorklog = {};
    worklogDetails.forEach((worklog) => {
        Object.keys(worklog).forEach((key) => {
          if (worklogs.hasOwnProperty(key)) {
            worklogs[key] = [...worklogs[key], ...worklog[key]];
          } else {
            worklogs[key] = [...worklog[key]];
          }
        });  
      });
    this.worklogRepository.save(worklogs);
  }
}

export default new WorklogService();
