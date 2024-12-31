import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { format, add } from "date-fns";
import { NextApiRequest, NextApiResponse } from "../../../node_modules/next/types";

import { DailyWorklog, WorklogStatus } from "@/lib/worklog/worklog.interface";
import { Headers } from "@/lib/requests/headers.enum";

export default async function handler(req: NextApiRequest, res: NextApiResponse<DailyWorklog>) {
  const requestId = uuidv4();
  console.log(`[${requestId}][${req.method}] ${req.url} headers=${JSON.stringify(req.headers, null, 2)} body=${JSON.stringify(req.body, null, 2)} m=get-worklogs-by-key stage=init`);

  if (req.method !== "GET") {
    console.error(`[${requestId}] m=get-worklogs-by-key stage=error error=Method not allowed`);
    return res.status(405).json({ error: "Method not allowed", requestId });
  }

  try {
    const { data } = await axios.get(`https://${req.headers[Headers.VMETRICS_URL]}/rest/api/3/issue/${req.query["key"]}/worklog`,
    {
      headers: {
        Authorization:
          `Basic ${req.headers[Headers.VMETRICS_AUTH]}`,
          "Content-Type": "application/json",
      },
    });
        
    const worklogsFiltered = data.worklogs
      .filter((worklog: any) => worklog.author.accountId === req.headers[Headers.VMETRICS_ACCOUNT_ID])
      .map((worklog: any) => ({
        uuid: uuidv4(),
        worklogId: worklog.id,
        status: WorklogStatus.SYNCED,
        ticket: req.query["key"],
        description: worklog?.comment?.content[0]?.content[0]?.text || req.query["summary"],
        date: {
          start: format(new Date(worklog.started), "HH:mm"),
          end: format(add(new Date(worklog.started), { seconds: worklog.timeSpentSeconds}), "HH:mm"),
        },
        key: format(new Date(worklog.started), "dd/MM/yyyy"),
      }))

    let worklogs: DailyWorklog = {}
    worklogsFiltered.forEach((worklog: any) => {
      if (worklogs.hasOwnProperty(worklog.key)) {
        worklogs[worklog.key] = [...worklogs[worklog.key], worklog];
      } else {
        worklogs[worklog.key] = [worklog];
      }
    });

    console.log(`[${requestId}] m=get-worklogs-by-key stage=end message=${JSON.stringify(worklogs)}`);
    res.status(200).json(worklogs);
  } catch (error) {
    console.error(`[${requestId}] m=get-worklogs-by-key stage=error error=${JSON.stringify(error)}`);
    res.status(500).json({ error: "Failed to fetch worklogs", requestId });
  }
}
