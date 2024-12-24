export interface Project {
    isActive: boolean;
    uuid?: string;
    name: string;
    email: string;
    jira: {
        url: string;
        apiKey: string;
    }
}