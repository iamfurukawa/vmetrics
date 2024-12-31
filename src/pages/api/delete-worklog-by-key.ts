import axios from "axios";
import { NextApiRequest, NextApiResponse } from "../../../node_modules/next/types";

import { Headers } from "@/lib/requests/headers.enum";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse) {

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
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
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting worklog:", error);
    res.status(500).json({ error: "Failed to delete worklog" });
  }
}
