import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import scores from "./routes/scores.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/db/health", async (_req, res) => {
  try {
    const r = await pool.query("SELECT 1");
    res.json({ ok: true, result: r.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.use("/api/scores", scores);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
