import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "../../../node_modules/next/types";

import { Headers } from "@/lib/requests/headers.enum";

export interface WorklogKeys {
  worklogs: {
    key: string,
    summary: string,
  }[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<WorklogKeys>) {
  const requestId = uuidv4();
  console.log(`[${requestId}][${req.method}] ${req.url} headers=${JSON.stringify(req.headers, null, 2)} body=${JSON.stringify(req.body, null, 2)} m=get-lasts-worklogs stage=init`);

  if (req.method !== "GET") {
    console.error(`[${requestId}] m=get-lasts-worklogs stage=error error=Method not allowed`);
    return res.status(405).json({ error: "Method not allowed", requestId });
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

    console.log(`[${requestId}] m=get-lasts-worklogs stage=end message=${JSON.stringify(worklogs)}`);
    res.status(200).json({worklogs});
  } catch (error) {
    console.error(`[${requestId}] m=get-lasts-worklogs stage=error error=${JSON.stringify(error)}`);
    res.status(500).json({ error: "Failed to fetch worklogs", requestId });
  }
}
