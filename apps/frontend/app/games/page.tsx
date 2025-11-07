import Link from "next/link";

export default function GamesPage() {
  return (
    <section>
      <h1 className="header">Games</h1>
      <p className="sub">Pick a game to play. More coming soon.</p>

      <div className="grid">
        <article className="card" style={{ padding: 18 }}>
          <h3>2048</h3>
          <p>Merge tiles to reach 2048.</p>
          <Link className="btn" href="/games/2048">
            Play
          </Link>
        </article>

        <article className="card" style={{ padding: 18 }}>
          <h3>Snake</h3>
          <p>Arcade snake with math-quiz.</p>
          <Link className="btn" href="/games/snake">
            Play
          </Link>
        </article>

        <article className="card" style={{ padding: 18 }}>
          <h3>Tiles</h3>
          <p>Pattern builder game.</p>
          <button className="btn" disabled>
            Coming Soon
          </button>
        </article>
      </div>
    </section>
  );
}
