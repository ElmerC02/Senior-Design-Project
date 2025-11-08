import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      {/* Hero */}
      <div
        className="card"
        style={{
          padding: 28,
          background:
            "radial-gradient(800px 400px at -10% -10%, rgba(138,92,255,.10), transparent 55%), radial-gradient(700px 400px at 110% 0%, rgba(58,122,254,.12), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.95), rgba(245,247,252,1))",
        }}
      >
        <h1 className="header" style={{ marginBottom: 6 }}>Uncool Math Games</h1>
        <p className="sub">Quick, brainy mini-games for memory and logic — no account required.</p>

        {/* 3 large choices */}
        <div className="grid" style={{ marginTop: 16 }}>
          <article className="card" style={{ padding: 18 }}>
            <h3 style={{ marginTop: 0 }}>🎮 Games</h3>
            <p>Play 2048 and Snake now, with more coming soon.</p>
            <Link className="btn" href="/games">Open Games</Link>
          </article>

          <article className="card" style={{ padding: 18 }}>
            <h3 style={{ marginTop: 0 }}>🏆 Leaderboard</h3>
            <p>See top scores across games. Demo data for now.</p>
            <Link className="btn" href="/leaderboard">View Leaderboard</Link>
          </article>

          <article className="card" style={{ padding: 18 }}>
            <h3 style={{ marginTop: 0 }}>✉️ Contact</h3>
            <p>Questions or feedback? Reach out here.</p>
            <Link className="btn" href="/contact">Contact</Link>
          </article>
        </div>
      </div>

      {/* Highlights */}
      <h2 className="header" style={{ fontSize: 22, marginTop: 24 }}>Highlights</h2>
      <div className="grid">
        <article className="card" style={{ padding: 18 }}>
          <h3>2048</h3>
          <p>Merge tiles to reach 2048. Keyboard, swipe, and on-screen controls with audio.</p>
          <Link className="btn" href="/games/2048">Play 2048</Link>
        </article>
        <article className="card" style={{ padding: 18 }}>
          <h3>Snake</h3>
          <p>Classic arcade Snake with a math-quiz “Continue” and audio cues.</p>
          <Link className="btn" href="/games/snake">Play Snake</Link>
        </article>
        <article className="card" style={{ padding: 18 }}>
          <h3>Tiles (Soon)</h3>
          <p>Pattern builder with timed rounds and streak bonuses.</p>
          <button className="btn" disabled>Coming Soon</button>
        </article>
      </div>
    </section>
  );
}
