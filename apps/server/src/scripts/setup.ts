// apps/server/src/scripts/setup.ts
import "dotenv/config";
import { readFileSync } from "fs";
import { resolve } from "path";
import { pool } from "../db";

async function runSQL(relPath: string, label: string) {
  const file = resolve(process.cwd(), "../../sql", relPath);
  const sql = readFileSync(file, "utf8");
  await pool.query(sql);
  console.log(`✅ ${label}`);
}

async function main() {
  // Order matters
  await runSQL("schema.sql", "Schema applied");
  await runSQL("seed.sql", "Seed data inserted");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
