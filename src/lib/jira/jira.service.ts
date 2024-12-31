import axios from "axios";
import { parse, format, differenceInSeconds } from "date-fns";

import { AccountLocalStorageService } from "@/lib/account/account-local-storage.service";
import ProjectService from "@/lib/project/project.service";
import { Worklog, WorklogStatus } from "@/lib/worklog/worklog.interface";
import WorklogService from "@/lib/worklog/worklog.service";

export interface IssueKeys {
  key: string;
  id?: string;
  summary?: string;
}

class JiraService {

  accountRepository: AccountLocalStorageService;

  constructor() {
    this.accountRepository = new AccountLocalStorageService();
  }

  generateAuthenticatedHeader(user: string, password: string): string {
    const credentials = `${user}:${password}`;
    return Buffer.from(credentials).toString("base64");
  }

  async getMyLastsTwoWeeksWorklogs(): Promise<IssueKeys[]> {
    const project = ProjectService.getActive();
    if (!project) return [];

    await this.getMyUserId();
    const accountId = this.accountRepository.get();
    if (!accountId) return [];

    try {
        const { data: { worklogs } } = await axios.get("/api/get-lasts-worklogs", { 
            headers: { 
                "vmetrics-url": project.jira.url,
                "vmetrics-auth": this.generateAuthenticatedHeader(project.email, project.jira.apiKey),
                "vmetrics-account-id": accountId,

                "Content-Type": "application/json",
            } 
        })
        return worklogs;
    } catch (error) {
        console.error(error);
        return [];
    }
  }

  async getWorklogsBy(key: IssueKeys) {
    const project = ProjectService.getActive();
    if (!project) return [];

    await this.getMyUserId();
    const accountId = this.accountRepository.get();
    if (!accountId) return [];

    try {
        const { data } = await axios.get(`/api/get-worklogs-by-key?key=${key.key}&summary=${key.summary}`, { 
            headers: { 
                "vmetrics-url": project.jira.url,
                "vmetrics-auth": this.generateAuthenticatedHeader(project.email, project.jira.apiKey),
                "vmetrics-account-id": accountId,

                "Content-Type": "application/json",
            } 
        })
        return data;
    } catch (error) {
        console.error(error);
    }
  }

  async getMyUserId() {
    const project = ProjectService.getActive();
    if (!project) return;

    const accountId = this.accountRepository.get();
    if (accountId) return;

    try {
        const { data: { accountId }} = await axios.get("/api/get-account-id", { 
            headers: { 
                "vmetrics-url": project.jira.url,
                "vmetrics-auth": this.generateAuthenticatedHeader(project.email, project.jira.apiKey),

                "Content-Type": "application/json",
            } 
        })
        this.accountRepository.save(accountId);
    } catch (error) {
        console.error(error);
    }
  }

  async deleteBy(key: IssueKeys) {
    const project = ProjectService.getActive();
    await axios.delete(`/api/delete-worklog-by-key?key=${key.key}&id=${key.id}`, { 
        headers: { 
            "vmetrics-url": project!.jira.url,
            "vmetrics-auth": this.generateAuthenticatedHeader(project!.email, project!.jira.apiKey),

            "Content-Type": "application/json",
        } 
    })
  }

  async sync(worklog: Worklog, actualDate: string): Promise<Worklog> {
    if(!this.shouldSync(worklog)) return worklog;
    
    try {
      if(worklog.worklogId)
        return await this.updateBy(worklog, actualDate);
      return await this.create(worklog, actualDate);
    } catch (error) {
      return worklog;
    }
  }

  async create(worklog: Worklog, actualDate: string): Promise<Worklog> {
    const project = ProjectService.getActive();
    const { data: { id } } = await axios.post(`/api/post-worklog?key=${worklog.ticket}`, this.worklogMapper(worklog, actualDate),
      { 
          headers: { 
              "vmetrics-url": project!.jira.url,
              "vmetrics-auth": this.generateAuthenticatedHeader(project!.email, project!.jira.apiKey),

              "Content-Type": "application/json",
          } 
      })

    worklog.worklogId = id;
    worklog.status = WorklogStatus.SYNCED;
    return worklog;
  }

  async updateBy(worklog: Worklog, actualDate: string): Promise<Worklog> {
    const project = ProjectService.getActive();
    await axios.put(`/api/put-worklog-by-key?key=${worklog.ticket}&id=${worklog.worklogId}`, this.worklogMapper(worklog, actualDate),          
    { 
        headers: { 
            "vmetrics-url": project!.jira.url,
            "vmetrics-auth": this.generateAuthenticatedHeader(project!.email, project!.jira.apiKey),

            "Content-Type": "application/json",
        } 
    })
    worklog.status = WorklogStatus.SYNCED;
    return worklog;
  }

  worklogMapper(worklog: Worklog, actualDate: string) {
    const startTime = parse(`${actualDate} ${worklog.date.start}`, 'dd/MM/yyyy HH:mm', new Date());
    const endTime = parse(`${actualDate} ${worklog.date.end}`, 'dd/MM/yyyy HH:mm', new Date());

    const timeSpentSeconds = differenceInSeconds(endTime, startTime);
    const started = format(startTime, "yyyy-MM-dd'T'HH:mm:ss.SSSXX");

    return { timeSpentSeconds, started, comment: worklog.description, worklogId: worklog.worklogId };
  }

  shouldSync(worklog: Worklog) {
    if(worklog.status === WorklogStatus.SYNCED) return false;
    if(!worklog.date.end) return false;
    if(worklog.description === "") return false;
    if(worklog.ticket === "") return false;

    const dateEnd = new Date(worklog.date.end);
    const dateStart = new Date(worklog.date.start);
    if(dateEnd < dateStart) return false;

    return true;
  }
}

export default new JiraService();
