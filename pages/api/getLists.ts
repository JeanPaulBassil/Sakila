import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface FilmList {
  title: string;
  name: string;
  release_year: string;
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse<FilmList[] | {error: string}>) {
//     if (req.method === 'GET'){
//         try {
//             const result = await pool.query('SELECT * FROM favorites ORDER BY id DESC LIMIT 5');
//             const favorites : FilmList[] = result.rows.map((row) => {
//                 title: row.title,
//                 name: row.member,
//             })
//         } catch (error){
//             res.status(500).json({error: error.message})
//         }
//     }
// }
