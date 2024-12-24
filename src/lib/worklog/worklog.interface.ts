export interface Worklog {
    description: string;
    date:{
        start: Date;
        end: Date;
    };
    ticket: string;
}