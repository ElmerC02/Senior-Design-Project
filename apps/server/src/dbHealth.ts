import "dotenv/config";
import { pool } from "./db.js";

(async () => {
  try {
    const r = await pool.query("SELECT 1");
    console.log("DB OK", r.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error("DB ERROR", err);
    process.exit(1);
  }
})();
