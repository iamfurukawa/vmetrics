import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "../../../node_modules/next/types";

import { Headers } from "@/lib/requests/headers.enum";

export interface Myself {
  accountId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Myself>) {
  const requestId = uuidv4();
  console.log(`[${requestId}][${req.method}] ${req.url} headers=${JSON.stringify(req.headers, null, 2)} body=${JSON.stringify(req.body, null, 2)} m=get-account-id stage=init`);

  if (req.method !== "GET") {
    console.error(`[${requestId}] m=get-account-id stage=error error=Method not allowed`);
    return res.status(405).json({ error: "Method not allowed", requestId });
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
    console.log(`[${requestId}] m=get-account-id stage=end message=${accountId}`);
    res.status(200).json({accountId});
  } catch (error) {
    console.error(`[${requestId}] m=get-account-id stage=error error=${JSON.stringify(error)}`);
    res.status(500).json({ error: "Failed to fetch account ID", requestId });
  }
}
