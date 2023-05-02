import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../data/sakila";

interface Film {
  title: string;
  duration: number;
  actors: string[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const listId = req.query.id;

      // SQL query to get film information and actor details for a specific list
      const result = await db.query(
        `
        SELECT f.film_id, f.title, f.length, a.actor_id, a.first_name, a.last_name
        FROM list_films lf
        JOIN film f ON lf.film_id = f.film_id
        JOIN film_actor fa ON f.film_id = fa.film_id
        JOIN actor a ON fa.actor_id = a.actor_id
        WHERE lf.list_id = $1
      `,
        [listId]
      );

      // Process the results to create film objects
      const films: Record<number, Film> = {};
      result.rows.forEach((row) => {
        if (!films[row.film_id]) {
          films[row.film_id] = {
            title: row.title,
            duration: row.length,
            actors: [],
          };
        }
        films[row.film_id].actors.push(`${row.first_name} ${row.last_name}`);
      });

      // Return the array of film objects as the API response
      res.status(200).json(Object.values(films));
    } catch (error) {
      console.error("Error fetching film information:", error);
      res.status(500).json({ message: "Failed to fetch film information." });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
};

export default handler;
