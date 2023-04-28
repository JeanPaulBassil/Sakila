import { NextApiRequest, NextApiResponse } from "next";
import db from "../../data/sakila";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { title, member, date } = req.body;
    console.log("sex");
    try {
      const result = db.query(
        `INSERT INTO favorites (title, member, date) VALUES ($1, $2, $3)`,
        [title, member, date]
      );

      res.status(200).json({ message: "List created successfully" });
    } catch (error) {
      // console.error('Database error:', error);
      res
        .status(500)
        .json({ message: "Error connecting to the database", error: error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
