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
    return worklogsStoraged[date] || [];
  }

  async create(worklog: Worklog, date: string) {
    const worklogs = this.worklogRepository.get() || {};

    worklog.uuid = uuidv4();
    worklog.status = worklog.status || WorklogStatus.PENDING;

    if (worklogs.hasOwnProperty(date)) {
      worklogs[date] = [...worklogs[date], worklog];
    } else {
      worklogs[date] = [worklog];
    }

    this.worklogRepository.save(worklogs);

    await this.updateBy(worklog, date);
  }

  async updateBy(worklog: Worklog, date: string): Promise<Worklog | undefined> {
    const worklogSynced = await JiraService.sync(worklog, date);
    
    const worklogs = this.worklogRepository.get() || {};
    worklogs[date] = worklogs[date].map((w) => {
      if (w.uuid === worklogSynced.uuid) {
        w.description = worklogSynced.description;
        w.date.start = worklogSynced.date.start;
        w.date.end = worklogSynced.date.end;
        w.ticket = worklogSynced.ticket;
        w.status = worklogSynced.status;
        w.worklogId = worklogSynced.worklogId || w.worklogId;
      }
      return w;
    });
    this.worklogRepository.save(worklogs);

    return worklogSynced;
  }

  async deleteBy(worklog: Worklog, date: string) {
    if(worklog.worklogId) {
      await JiraService.deleteBy({ key: worklog.ticket, id: worklog.worklogId });
    }

    const worklogs = this.worklogRepository.get() || {};
    worklogs[date] = worklogs[date].filter((w) => w.uuid !== worklog.uuid);
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
