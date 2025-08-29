import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const syncHeader = req.headers["x-auth-sync"] || null;
  res.status(200).json({ syncHeader });
}