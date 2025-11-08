import { Router } from "express";
import { pool } from "../db";

const router = Router();

/**
 * GET /api/scores/top/:code
 * Returns top 10 scores for a given game code (e.g., 2048, snake, tiles)
 */
router.get("/top/:code", async (req, res) => {
  const { code } = req.params;
  try {
    const { rows } = await pool.query(
      `
      SELECT u.display_name AS user, s.value AS score
      FROM scores s
      JOIN games g   ON g.id = s.game_id
      JOIN users u   ON u.id = s.user_id
      WHERE g.code = $1
      ORDER BY s.value DESC
      LIMIT 10
      `,
      [code]
    );
    res.json({ game: code, items: rows.map((r, i) => ({ rank: i + 1, ...r })) });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
