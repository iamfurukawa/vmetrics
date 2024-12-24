export interface Project {
    name: string;
    email: string;
    jira: {
        url: string;
        apiKey: string;
    }
}