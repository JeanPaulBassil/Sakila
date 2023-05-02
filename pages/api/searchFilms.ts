import { NextApiRequest, NextApiResponse } from "next";
import { FilmData } from "../[list]/addFilms";
import db from "../../data/sakila";

const searchFilms = async (req: NextApiRequest, res: NextApiResponse) => {
  const { category, title, actor } = req.query;

  try {
    const queryParams = [];
    let queryText = `
      SELECT DISTINCT f.film_id AS id, f.title
      FROM film f
      LEFT JOIN film_category fc ON f.film_id = fc.film_id
      LEFT JOIN category c ON fc.category_id = c.category_id
      LEFT JOIN film_actor fa ON f.film_id = fa.film_id
      LEFT JOIN actor a ON fa.actor_id = a.actor_id
      WHERE 1=1
    `;

    if (title) {
      queryParams.push(`%${title}%`);
      queryText += ` AND f.title ILIKE $${queryParams.length}`;
    }

    if (actor) {
      queryParams.push(`%${actor}%`);
      queryText += ` AND (a.first_name ILIKE $${queryParams.length} OR a.last_name ILIKE $${queryParams.length})`;
    }

    if (category && category !== "Select category") {
      queryParams.push(category);
      queryText += ` AND c.name = $${queryParams.length}`;
    }

    queryText += " ORDER BY f.title";

    const { rows } = await db.query<FilmData>(queryText, queryParams);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error searching films", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default searchFilms;
