import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "../../../node_modules/next/types";

import { Headers } from "@/lib/requests/headers.enum";

export interface Worklog {
  id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Worklog>) {
  const requestId = uuidv4();
  console.log(`[${requestId}][${req.method}] ${req.url} headers=${JSON.stringify(req.headers, null, 2)} body=${JSON.stringify(req.body, null, 2)} m=post-worklog stage=init`);

  if (req.method !== "POST") {
    console.error(`[${requestId}] m=post-worklog stage=error error=Method not allowed`);
    return res.status(405).json({ error: "Method not allowed", requestId });
  }

  try {
    const { data: { id } } = await axios.post(`https://${req.headers[Headers.VMETRICS_URL]}/rest/api/2/issue/${req.query['key']}/worklog`,
    JSON.stringify({
      "comment": req.body['comment'],
      "started": req.body['started'],
      "timeSpentSeconds": req.body['timeSpentSeconds'],
    }), 
    {
      headers: {
        Authorization:
          `Basic ${req.headers[Headers.VMETRICS_AUTH]}`,
          "Content-Type": "application/json",
      },
    });

    console.log(`[${requestId}] m=post-worklog stage=end message=${id}`);
    res.status(200).json({id});
  } catch (error) {
    console.error(`[${requestId}] m=post-worklog stage=error error=${JSON.stringify(error)}`);
    res.status(500).json({ error: "Failed to create worklog", requestId });
  }
}
