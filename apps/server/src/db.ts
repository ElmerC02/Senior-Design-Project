// db.ts
import { Pool } from "pg";

export const pool = new Pool({
  user: "umg",
  host: "127.0.0.1",  // <--- NOT "localhost"
  database: "umg",
  password: "umg",
  port: 5555,         // the host port mapped in docker-compose
});
