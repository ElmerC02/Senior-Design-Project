import { readFileSync } from "fs";
import { resolve } from "path";
import { pool } from "../db";

async function main() {
  const sql = readFileSync(resolve(process.cwd(), "../../sql/seed.sql"), "utf8");
  await pool.query(sql);
  console.log("✅ Seed data inserted");
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
