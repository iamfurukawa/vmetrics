import axios from "axios";
import { NextApiRequest, NextApiResponse } from "../../../node_modules/next/types";

import { Worklog } from "@/lib/worklog/worklog.interface";
import { Headers } from "@/lib/requests/headers.enum";
import worklogService from "@/lib/worklog/worklog.service";

export interface WorklogKeys {
  worklogs: {
    key: string,
    summary: string,
  }[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WorklogKeys>) {

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data } = await axios.post(`https://${req.headers[Headers.VMETRICS_URL]}/rest/api/2/search`,
    JSON.stringify({
      jql: `worklogAuthor = ${req.headers[Headers.VMETRICS_ACCOUNT_ID]} AND updated >= -1w`,
      fields: ["summary"]
    }), 
    {
      headers: {
        Authorization:
          `Basic ${req.headers[Headers.VMETRICS_AUTH]}`,
          "Content-Type": "application/json",
      },
    });
    const worklogs = data.issues.map((worklog: any) => ({key: worklog.key, summary: worklog.fields.summary}));

    //const worklogs = [{key: 'COREP-6399', summary: "COREP - Meetings"}, {key: 'COREP-6399', summary: "COREP - Meetings"}];
    res.status(200).json({worklogs});
  } catch (error) {
    console.error("Error fetching worklogs:", error);
    res.status(500).json({ error: "Failed to fetch worklogs" });
  }
}
