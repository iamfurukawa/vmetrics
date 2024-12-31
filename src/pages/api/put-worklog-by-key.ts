import axios from "axios";
import { format, add } from "date-fns";
import { NextApiRequest, NextApiResponse } from "../../../node_modules/next/types";

import { Headers } from "@/lib/requests/headers.enum";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse) {

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
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
    res.status(204).end();
  } catch (error) {
    console.error("Error on update worklog:", error);
    res.status(500).json({ error: "Failed to update worklog" });
  }
}
