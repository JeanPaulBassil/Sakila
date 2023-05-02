import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../data/sakila";

// interface for my lists containing a title, member, and date (in date)
interface List {
  id: number;
  title: string;
  member: string;
  date: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const queryResult = await db.query<List>(`SELECT * FROM favorites`);
      const result = queryResult.rows.map((row: List) => {
        return {
          id: row.id,
          title: row.title,
          member: row.member,
          date: row.date,
        };
      });

      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error connecting to the database", error: error });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
