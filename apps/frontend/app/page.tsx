"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);

  // Close modal with Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLoginOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="page-shell">
      <style>{`
        :root {
          --bg: #f3f4f6;
          --card-bg: #ffffff;
          --border: rgba(15, 23, 42, 0.08);
          --text-main: #111827;
          --text-muted: #4b5563;
          --accent: #2563eb;
          --accent-hover: #1d4ed8;
          --accent-soft: #dbeafe;
          --radius-lg: 18px;
          --radius-md: 14px;
        }

        * { box-sizing: border-box; }
        a { text-decoration: none; color: inherit; }

        .page-shell {
          min-height: 100vh;
          background: radial-gradient(900px 500px at 10% 0%, rgba(37,99,235,0.08), transparent 60%),
                      radial-gradient(900px 500px at 90% 10%, rgba(138,92,255,0.08), transparent 55%),
                      var(--bg);
          color: var(--text-main);
          display: flex;
          flex-direction: column;
          animation: fadeInPage 0.6s ease forwards;
          opacity: 0;
        }

        @keyframes fadeInPage { to { opacity: 1; } }

        main { flex: 1; padding: 20px 16px 32px; }
        .content { max-width: 960px; margin: 0 auto; }

        .hero-card {
          padding: 26px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          background:
            radial-gradient(900px 380px at -10% -10%, rgba(138,92,255,.10), transparent 55%),
            radial-gradient(800px 380px at 110% 0%, rgba(58,122,254,.12), transparent 55%),
            linear-gradient(180deg, rgba(255,255,255,.98), rgba(245,247,252,1));
          box-shadow: 0 18px 42px rgba(15, 23, 42, 0.10);
          position: relative;
          overflow: hidden;
        }

        .hero-card::before {
          content: "";
          position: absolute;
          inset: -40%;
          background: radial-gradient(circle at 20% 20%, rgba(37,99,235,0.10), transparent 35%),
                      radial-gradient(circle at 70% 30%, rgba(138,92,255,0.10), transparent 35%),
                      radial-gradient(circle at 40% 80%, rgba(34,197,94,0.06), transparent 35%);
          filter: blur(10px);
          pointer-events: none;
        }

        .hero-inner { position: relative; z-index: 1; }

        .hero-heading { margin: 0 0 6px; font-size: 30px; letter-spacing: -0.02em; }
        .hero-sub {
          margin: 0 0 16px;
          font-size: 15px;
          color: var(--text-muted);
          max-width: 600px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 12px;
        }

        /* Lively buttons */
        .btn-primary {
          padding: 12px 18px;
          border-radius: 999px;
          background: linear-gradient(180deg, #2f6cff, #1f4ed8);
          color: white;
          border: none;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.20);
        }

        .btn-primary::after {
          content: "";
          position: absolute;
          top: -60%;
          left: -30%;
          width: 40%;
          height: 220%;
          background: rgba(255, 255, 255, 0.25);
          transform: rotate(20deg);
          transition: left 0.35s ease;
        }

        .btn-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 18px 40px rgba(37, 99, 235, 0.28);
          filter: brightness(1.02);
        }

        .btn-primary:hover::after { left: 110%; }

        .btn-primary:active {
          transform: translateY(0px) scale(0.99);
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.20);
        }

        .btn-ghost {
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.12);
          background: rgba(255,255,255,0.9);
          cursor: pointer;
          transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .btn-ghost:hover {
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.10);
        }

        .btn-ghost:active { transform: translateY(0px); box-shadow: none; }

        .hero-note { font-size: 13px; color: var(--text-muted); margin: 0; }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .card {
          padding: 18px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: var(--card-bg);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 38px rgba(15, 23, 42, 0.10);
          outline: 2px solid rgba(37, 99, 235, 0.10);
        }

        .card-step-label {
          font-size: 11px;
          text-transform: uppercase;
          color: #6b7280;
          margin: 0;
        }

        .card-title { margin: 6px 0; font-size: 18px; }
        .card-text { font-size: 14px; color: var(--text-muted); }

        .btn-card {
          margin-top: 12px;
          padding: 10px 14px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(180deg, #eff6ff, #dbeafe);
          color: #1d4ed8;
          font-weight: 900;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
          filter: brightness(0.98);
        }

        .btn-card:active {
          transform: translateY(0px);
          box-shadow: 0 6px 14px rgba(15, 23, 42, 0.10);
        }

        .card-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 14px;
          margin-bottom: 12px;
        }

        .section-heading { font-size: 20px; margin: 28px 0 6px; }
        .section-sub { font-size: 14px; color: var(--text-muted); margin: 0; }

        footer.site-footer {
          padding: 16px 20px;
          font-size: 13px;
          color: #6b7280;
          text-align: center;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          visibility: hidden;
          transition: 0.25s ease;
          padding: 16px;
          z-index: 50;
        }

        .modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .modal {
          background: white;
          padding: 22px;
          border-radius: 16px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 22px 60px rgba(0,0,0,0.25);
        }

        .modal h2 { margin: 0 0 12px; }
        .modal input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }

        .modal button {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: none;
          background: var(--accent);
          color: white;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .modal button:hover { background: var(--accent-hover); }

        @media (max-width: 600px) {
          .btn-primary, .btn-ghost { width: 100%; }
        }
      `}</style>

      {/* IMPORTANT: No header here (layout.tsx should provide it) */}

      <main>
        <div className="content">
          <section className="hero-card">
            <div className="hero-inner">
              <h1 className="hero-heading">Uncool Math Games</h1>
              <p className="hero-sub">
                Simple, one-screen math mini-games for all ages. No account, no setup. Click “Play a
                Game” and you’re ready to go.
              </p>

              <div className="hero-actions">
                <Link className="btn-primary" href="/games">
                  Play a Game
                </Link>
                <a className="btn-ghost" href="#games-list">
                  See All Games
                </a>
                <button className="btn-ghost" onClick={() => setLoginOpen(true)}>
                  Login
                </button>
              </div>

              <p className="hero-note">
                Tip: Start with “2048” if you are new to math games. It’s slow and easy to
                understand.
              </p>

              <div className="grid">
                <article className="card">
                  <div>
                    <p className="card-step-label">Step 1</p>
                    <h3 className="card-title">Play a Game</h3>
                    <p className="card-text">
                      Choose a game like 2048 or Snake. Each game has clear controls and short
                      instructions.
                    </p>
                  </div>
                  <Link className="btn-card" href="/games">
                    Open Games
                  </Link>
                </article>

                <article className="card">
                  <div>
                    <p className="card-step-label">Step 2</p>
                    <h3 className="card-title">See High Scores</h3>
                    <p className="card-text">
                      After you play, you can look at the high scores for each game.
                    </p>
                  </div>
                  <Link className="btn-card" href="/leaderboard">
                    View High Scores
                  </Link>
                </article>

                <article className="card">
                  <div>
                    <p className="card-step-label">Step 3</p>
                    <h3 className="card-title">Need Help?</h3>
                    <p className="card-text">
                      If you’re not sure what to click, send us a message and we’ll help.
                    </p>
                  </div>
                  <Link className="btn-card" href="/contact">
                    Get Help
                  </Link>
                </article>
              </div>
            </div>
          </section>

          <section id="games-list">
            <h2 className="section-heading">Pick a Game to Try</h2>
            <p className="section-sub">
              Start with any game below. Each game opens full screen with simple controls and sound
              cues.
            </p>

            <div className="grid">
              <article className="card">
                <img className="card-img" src="https://play2048.co/twitterImage.jpg" alt="2048" />
                <h3 className="card-title">2048</h3>
                <p className="card-text">
                  Merge numbered tiles until you reach 2048. Use arrow keys or on-screen buttons.
                </p>
                <Link className="btn-card" href="/games/2048">
                  Play 2048
                </Link>
              </article>

              <article className="card">
                <img
                  className="card-img"
                  src="https://www.fortressofsolitude.co.za/wp-content/uploads/2022/03/Google-Snake-Game-Easter-Egg-How-To-Play-Rules-Explained.jpeg"
                  alt="Snake"
                />
                <h3 className="card-title">Snake</h3>
                <p className="card-text">
                  Move the snake to collect points without hitting walls. Math question appears to
                  continue.
                </p>
                <Link className="btn-card" href="/games/snake">
                  Play Snake
                </Link>
              </article>

              <article className="card">
                <img
                  className="card-img"
                  src="https://cdn.vectorstock.com/i/750p/65/40/vibrant-bingo-poster-vector-20026540.avif"
                  alt="Bingo"
                />
                <h3 className="card-title">Bingo</h3>
                <p className="card-text">
                  Classic number-matching bingo. Click Play to open the Bingo page.
                </p>
                <Link className="btn-card" href="/games/bingo">
                  Play Bingo
                </Link>
              </article>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">© 2025 CSUN CIT 480 | UNCOOL MATH GAMES</footer>

      {/* Login Modal */}
      <div
        className={`modal-overlay ${loginOpen ? "active" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setLoginOpen(false);
        }}
      >
        <div className="modal">
          <h2>Login</h2>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button onClick={() => setLoginOpen(false)}>Log In</button>

          <div style={{ marginTop: 12, textAlign: "center", fontSize: 14 }}>
            <Link href="/account" style={{ color: "#2563eb", display: "block", marginTop: 6 }}>
              Create Account
            </Link>
            <Link href="/login" style={{ color: "#2563eb", display: "block", marginTop: 6 }}>
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
