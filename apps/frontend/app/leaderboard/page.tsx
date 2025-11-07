"use client";

import { useEffect, useState } from "react";

type Item = { rank: number; user: string; score: number };

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Item[]>([]);
  const [game, setGame] = useState("2048");

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${api}/api/scores/top/${encodeURIComponent(game)}`)
      .then((r) => r.json())
      .then((data) => setRows(data.items ?? []))
      .catch(() => setRows([{ rank: 1, user: "Guest", score: 512 }]));
  }, [game]);

  return (
    <section>
      <h1 className="header">Leaderboard</h1>
      <label>
        Game:&nbsp;
        <select value={game} onChange={(e) => setGame(e.target.value)}>
          <option value="2048">2048</option>
          <option value="snake">Snake</option>
          <option value="tiles">Tiles</option>
        </select>
      </label>
      <div style={{ marginTop: 16 }}>
        <table>
          <thead>
            <tr><th>#</th><th>Player</th><th>Score</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.rank}>
                <td>{r.rank}</td>
                <td>{r.user}</td>
                <td>{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
