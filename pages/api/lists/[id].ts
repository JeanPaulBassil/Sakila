import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../data/sakila";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    try {
      const id = req.query.id;
      console.log("LOG: " + req.query);
      await db.query("DELETE FROM favorites WHERE id = $1", [id]);

      res.status(200).json({ message: "List deleted successfully." });
    } catch (error) {
      console.error("Error deleting list:", error);
      res.status(500).json({ message: "Failed to delete list." });
    }
  } else {
    res.setHeader("Allow", "DELETE");
    res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
};

export default handler;
