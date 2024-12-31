import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "../../../node_modules/next/types";

import { Headers } from "@/lib/requests/headers.enum";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestId = uuidv4();
  console.log(`[${requestId}][${req.method}] ${req.url} headers=${JSON.stringify(req.headers, null, 2)} body=${JSON.stringify(req.body, null, 2)} m=put-worklog-by-key stage=init`);

  if (req.method !== "PUT") {
    console.error(`[${requestId}] m=put-worklog-by-key stage=error error=Method not allowed`);
    return res.status(405).json({ error: "Method not allowed", requestId });
  }

  try {
    await axios.put(`https://${req.headers[Headers.VMETRICS_URL]}/rest/api/2/issue/${req.query['key']}/worklog/${req.body['worklogId']}`,
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
    console.log(`[${requestId}] m=put-worklog-by-key stage=end message=Worklog updated successfully`);
    res.status(204).end();
  } catch (error) {
    console.error(`[${requestId}] m=put-worklog-by-key stage=error error=${JSON.stringify(error)}`);
    res.status(500).json({ error: "Failed to update worklog", requestId });
  }
}
