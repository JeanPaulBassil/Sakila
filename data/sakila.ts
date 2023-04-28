import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect();

// Uncomment the following code to test the connection and fetch data from the 'actor' table
// pool.query('SELECT * FROM actor', (err, res) => {
//   if (!err) {
//     console.table(res.rows);
//   } else {
//     console.log(err.message);
//   }
// });

export default pool;
