import { readFileSync } from "fs";
import { resolve } from "path";
import { pool } from "../db";

async function main() {
  const sql = readFileSync(resolve(process.cwd(), "../../sql/schema.sql"), "utf8");
  await pool.query(sql);
  console.log("✅ Schema applied");
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
