import axios from "axios";
import { NextApiRequest, NextApiResponse } from "../../../node_modules/next/types";

import { Headers } from "@/lib/requests/headers.enum";

export interface Myself {
  accountId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Myself>) {

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data: { accountId } } = await axios.get(`https://${req.headers[Headers.VMETRICS_URL]}/rest/api/3/myself`, 
    {
      headers: {
        Authorization:
          `Basic ${req.headers[Headers.VMETRICS_AUTH]}`,
          "Content-Type": "application/json",
      },
    });
    
    res.status(200).json({accountId});
  } catch (error) {
    console.error("Error fetching account ID:", error);
    res.status(500).json({ error: "Failed to fetch account ID" });
  }
}
