import { Router } from "express";
import { pool } from "../db";

const router = Router();

/**
 * GET /api/scores/top/:code
 * Best score per user for a game (top 10).
 */
router.get("/top/:code", async (req, res) => {
  const { code } = req.params;
  try {
    const { rows } = await pool.query(
      `
      WITH ranked AS (
        SELECT
          u.display_name AS user,
          s.value AS score,
          s.submitted_at,
          ROW_NUMBER() OVER (
            PARTITION BY s.user_id, s.game_id
            ORDER BY s.value DESC, s.submitted_at ASC
          ) AS rn
        FROM scores s
        JOIN games g ON g.id = s.game_id
        JOIN users u ON u.id = s.user_id
        WHERE g.code = $1
      )
      SELECT user, score, submitted_at
      FROM ranked
      WHERE rn = 1
      ORDER BY score DESC, submitted_at ASC
      LIMIT 10;
      `,
      [code]
    );
    res.json({
      game: code,
      items: rows.map((r, i) => ({
        rank: i + 1,
        user: r.user,
        score: r.score,
        submitted_at: r.submitted_at,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

/**
 * POST /api/scores/submit
 * Body: { email, displayName?, code, value }
 * Validates, upserts user, ensures game, inserts score with submitted_at.
 * Returns 201 + { id }.
 */
router.post("/submit", async (req, res) => {
  const { email, displayName, code, value } = req.body ?? {};

  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required" });
  }
  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ error: "Game code is required" });
  }
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) {
    return res.status(400).json({ error: "value must be a non-negative number" });
  }

  try {
    const u = await pool.query(
      `INSERT INTO users (email, display_name)
       VALUES ($1, COALESCE($2, regexp_replace($1,'@.*$','')))
       ON CONFLICT (email) DO UPDATE
         SET display_name = COALESCE(EXCLUDED.display_name, users.display_name),
             updated_at = now()
       RETURNING id;`,
      [email, displayName]
    );
    const userId = u.rows[0].id;

    const g = await pool.query(`SELECT id FROM games WHERE code = $1;`, [code]);
    if (g.rowCount === 0) {
      return res.status(404).json({ error: `Unknown game code "${code}"` });
    }
    const gameId = g.rows[0].id;

    const ins = await pool.query(
      `INSERT INTO scores (user_id, game_id, value, submitted_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id;`,
      [userId, gameId, num]
    );

    res.status(201).json({ id: ins.rows[0].id });
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

export default router;
