import axios from "axios";

import { WorklogLocalStorageService } from "../worklog/worklog-local-storage.service";
import { AccountLocalStorageService } from "@/lib/account/account-local-storage.service";
import ProjectService from "@/lib/project/project.service";
import { Worklog } from "@/lib/worklog/worklog.interface";

export interface IssueKeys {
  key: string;
  id?: string;
  summary?: string;
}

class JiraService {

  accountRepository: AccountLocalStorageService;
  worklogRepository: WorklogLocalStorageService;

  constructor() {
    this.accountRepository = new AccountLocalStorageService();
    this.worklogRepository = new WorklogLocalStorageService();
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
    if (!project) return [];

    await this.getMyUserId();
    const accountId = this.accountRepository.get();
    if (!accountId) return [];

    try {
        await axios.delete(`/api/delete-worklog-by-key?key=${key.key}&id=${key.id}`, { 
            headers: { 
                "vmetrics-url": project.jira.url,
                "vmetrics-auth": this.generateAuthenticatedHeader(project.email, project.jira.apiKey),
                "vmetrics-account-id": accountId,

                "Content-Type": "application/json",
            } 
        })
    } catch (error) {
        console.error(error);
    }
  }

  async create(worklog: Worklog) {
    const project = ProjectService.getActive();
    if (!project) return [];

    try {
        const { data } = await axios.post(`/api/get-worklog?key=${worklog.ticket}`, {
          "comment": worklog.description,
          "started": ,
          "timeSpentSeconds": ,
        },          
        { 
            headers: { 
                "vmetrics-url": project.jira.url,
                "vmetrics-auth": this.generateAuthenticatedHeader(project.email, project.jira.apiKey),

                "Content-Type": "application/json",
            } 
        })
        return data;
    } catch (error) {
        console.error(error);
    }
  }

  async updateBy(worklog: Worklog) {
    const project = ProjectService.getActive();
    if (!project) return [];

    try {
        const { data } = await axios.put(`/api/get-worklog?key=${worklog.ticket}&id=${worklog.worklogId}`, {
          "comment": worklog.description,
          "started": ,
          "timeSpentSeconds": ,
        },          
        { 
            headers: { 
                "vmetrics-url": project.jira.url,
                "vmetrics-auth": this.generateAuthenticatedHeader(project.email, project.jira.apiKey),

                "Content-Type": "application/json",
            } 
        })
        return data;
    } catch (error) {
        console.error(error);
    }
  }
}

export default new JiraService();
