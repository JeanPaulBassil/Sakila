import { NextApiRequest, NextApiResponse } from "next";
import db from "../../data/sakila";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { listId, filmId } = req.body;

    if (!listId || !filmId) {
      res
        .status(400)
        .json({ message: "Missing listId or filmId in the request body" });
      return;
    }

    try {
      const result = await db.query(
        "INSERT INTO list_films (list_id, film_id) VALUES ($1, $2)",
        [listId, filmId]
      );

      if (result.rowCount === 1) {
        res
          .status(200)
          .json({ message: "Film added to the list successfully" });
      } else {
        res.status(500).json({ message: "Failed to add film to the list" });
      }
    } catch (error) {
      console.error("Error adding film to the list:", error);
      res.status(500).json({ message: "Error adding film to the list" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;
