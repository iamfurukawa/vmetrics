import axios from "axios";
import { NextApiRequest, NextApiResponse } from "../../../node_modules/next/types";

import { Headers } from "@/lib/requests/headers.enum";

export interface Worklog {
  id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Worklog>) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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

    res.status(200).json({id});
  } catch (error) {
    console.error("Error create worklog:", error);
    res.status(500).json({ error: "Failed to create worklog" });
  }
}
