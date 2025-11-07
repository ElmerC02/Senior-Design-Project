import { Pool } from "pg";

const url = process.env.DATABASE_URL || "postgresql://umg:umg@localhost:5432/umg";

export const pool = new Pool({ connectionString: url });
