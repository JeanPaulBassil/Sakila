import { NextApiRequest, NextApiResponse } from "next";
import db from "../../data/sakila";

const searchFilms = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { category, title, actor } = req.query;

  try {
    let query = `
      SELECT DISTINCT f.film_id, f.title
      FROM film f
      LEFT JOIN film_category fc ON f.film_id = fc.film_id
      LEFT JOIN category c ON fc.category_id = c.category_id
      LEFT JOIN film_actor fa ON f.film_id = fa.film_id
      LEFT JOIN actor a ON fa.actor_id = a.actor_id
      WHERE 1=1
    `;

    if (category) {
      query += " AND c.name ILIKE $1";
    }

    if (title) {
      query += " AND f.title ILIKE $2";
    }

    if (actor) {
      query += " AND (a.first_name ILIKE $3 OR a.last_name ILIKE $3)";
    }

    const films = await db.query(query, [
      category ? `%${category}%` : null,
      title ? `%${title}%` : null,
      actor ? `%${actor}%` : null,
    ]);

    res.status(200).json(films.rows);
  } catch (error) {
    console.error("Error searching films:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default searchFilms;
