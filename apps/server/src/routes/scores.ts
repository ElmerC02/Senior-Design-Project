import { Router } from "express";

const router = Router();

// Demo data until DB wiring is complete
const demo = {
  "2048": [
    { rank: 1, user: "Ada", score: 2048 },
    { rank: 2, user: "Grace", score: 1024 },
    { rank: 3, user: "Linus", score: 768 }
  ],
  "snake": [
    { rank: 1, user: "Alan", score: 87 },
    { rank: 2, user: "Hedy", score: 74 },
    { rank: 3, user: "Ken", score: 61 }
  ],
  "tiles": [
    { rank: 1, user: "Barbara", score: 44 },
    { rank: 2, user: "Edsger", score: 33 },
    { rank: 3, user: "Don", score: 22 }
  ]
};

router.get("/top/:code", async (req, res) => {
  const { code } = req.params;
  const items = demo[code] || [];
  return res.json({ game: code, items });
});

export default router;
