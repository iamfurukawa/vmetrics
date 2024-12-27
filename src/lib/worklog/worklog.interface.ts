export interface DailyWorklog {
    [key: string]: Worklog[];
}
export interface Worklog {
    uuid?: string;
    worklogId?: string;
    status?: WorklogStatus;
    description: string;
    ticket: string;
    date:{
        start: string;
        end?: string;
    };
}

export enum WorklogStatus {
    PENDING = "PENDING",
    SYNCED = "SYNCED",
}