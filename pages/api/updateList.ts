import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../data/sakila";

interface FilmList {
  id: number;
  title: string;
  member: string;
  date: Date;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, title, member, date } = req.body as FilmList;

  try {
    const query = `
    UPDATE favorites
    SET title = $2, member = $3, date = $4
    WHERE id = $1;
    `;
    await db.query(query, [id, title, member, date]);
    res.status(200).json({ message: "List updated successfully" });
  } catch (error) {
    console.error("Error updating list:", error);
    res.status(500).json({ message: "Failed to update list" });
  }
};

export default handler;
