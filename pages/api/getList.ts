import { NextApiRequest, NextApiResponse } from "next";
import db from "../../data/sakila";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const id = req.query.id;
      const filmList = await db.query(
        `SELECT * FROM favorites WHERE id = ${id}`
      );
      return res.status(200).json(filmList.rows[0]);
    } catch (error) {
      console.error("Error fetching film", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
