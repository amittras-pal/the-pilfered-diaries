import crypto from "crypto";
import { NextApiHandler } from "next";

interface RevalidationReqBody {
  pwd: string;
  paths: string[];
}

const handler: NextApiHandler = async (req, res) => {
  // only works with post.
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Supported" });

  // Request Body Validation..
  const { pwd, paths = [] } = req.body as RevalidationReqBody;
  if (!pwd || !paths.length)
    return res.status(400).json({ error: "Required fields not provided." });

  const salt = process.env.SALT ?? "";
  const pwdHash = process.env.PWD_HASH ?? "";
  if (!salt.length || !pwdHash.length)
    res
      .status(500)
      .json({ error: "Password Validation failed; Key Not Found!" });

  // TODO: (should transmit encrypted password from FE) Password Validity.
  const hash = crypto.pbkdf2Sync(pwd, salt, 768, 64, "sha256").toString("hex");
  if (hash !== pwdHash) res.status(401).json({ error: "Invalid Credentials!" });

  try {
    const pagesToRevalidate = paths.map((route) => res.revalidate(route));
    await Promise.all(pagesToRevalidate);
    return res.json({ message: `Refreshed pages: ${paths.join(", ")}` });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

export default handler;
