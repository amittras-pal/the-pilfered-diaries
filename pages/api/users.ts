import { getAuth } from "firebase-admin/auth";
import { NextApiHandler } from "next";
import admin from "../../firebase/server.config";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method Not Supported" });

  const listing = await getAuth(admin.app()).listUsers(100);
  return res.json(listing);
};

export default handler;
