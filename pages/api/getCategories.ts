import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../data/sakila";

type CategoryRow = {
  category: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Only GET requests are allowed." });
    return;
  }

  try {
    const { rows } = await db.query(
      "SELECT DISTINCT(category.name) as category FROM category INNER JOIN film_category ON category.category_id = film_category.category_id ORDER BY category.name;"
    );

    const categories = (rows as CategoryRow[]).map((row) => row.category);
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
}

export default handler;
