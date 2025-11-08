import "dotenv/config";            // ⬅ add this as the first line
import { Pool } from "pg";

const url = process.env.DATABASE_URL || "postgresql://umg:umg@localhost:5433/umg";
export const pool = new Pool({ connectionString: url });
