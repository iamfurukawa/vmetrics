import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "../../../node_modules/next/types";

import { Headers } from "@/lib/requests/headers.enum";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestId = uuidv4();
  console.log(`[${requestId}][${req.method}] ${req.url} headers=${JSON.stringify(req.headers, null, 2)} body=${JSON.stringify(req.body, null, 2)} m=delete-worklog-by-key stage=init`);
  if (req.method !== "DELETE") {
    console.error(`[${requestId}] m=delete-worklog-by-key stage=error error=Method not allowed`);
    return res.status(405).json({ error: "Method not allowed", requestId });
  }

  try {
    await axios.delete(`https://${req.headers[Headers.VMETRICS_URL]}/rest/api/3/issue/${req.query['key']}/worklog/${req.query['id']}`,
    {
      headers: {
        Authorization:
          `Basic ${req.headers[Headers.VMETRICS_AUTH]}`,
          "Content-Type": "application/json",
      },
    });

    console.log(`[${requestId}] m=delete-worklog-by-key stage=end message=Worklog deleted successfully`);
    res.status(204).end();
  } catch (error) {
    console.error(`[${requestId}] m=delete-worklog-by-key stage=error error=${JSON.stringify(error)}`);
    res.status(500).json({ error: "Failed to delete worklog", requestId });
  }
}
