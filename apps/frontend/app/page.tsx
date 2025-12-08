"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-shell">
      {/* HEADER */}
      <header className="site-header" aria-label="Main site header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-title">Uncool Math Games</div>
            <div className="brand-subtitle">Simple math games. Just play. Have Fun.</div>
          </div>

          <nav className="main-nav">
            <Link href="/" className="nav-link current">
              Home
            </Link>
            <Link href="/games" className="nav-link">
              Games
            </Link>
            <Link href="/leaderboard" className="nav-link">
              High Scores
            </Link>
            <Link href="/contact" className="nav-link">
              Help
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <div className="content">
          {/* HERO CARD */}
          <section className="hero-card">
            <h1 className="hero-heading">Uncool Math Games</h1>
            <p className="hero-sub">
              Simple, one-screen math mini-games for all ages. No account, no setup. Click “Play a
              Game” and you’re ready to go.
            </p>

            <div className="hero-actions">
              <Link href="/games" className="btn-primary">
                Play a Game
              </Link>
              <a href="#games-list" className="btn-ghost">
                See All Games
              </a>
            </div>

            <p className="hero-note">
              Tip: Start with “2048” if you’re new to math games. It’s slow and easy to understand.
            </p>

            {/* STEPS */}
            <div className="grid">
              <article className="card">
                <p className="card-step-label">Step 1</p>
                <h3 className="card-title">Play a Game</h3>
                <p className="card-text">
                  Choose a game like 2048 or Snake. Each game has clear controls and short
                  instructions.
                </p>
                <Link href="/games" className="btn-card">
                  Open Games
                </Link>
              </article>

              <article className="card">
                <p className="card-step-label">Step 2</p>
                <h3 className="card-title">See High Scores</h3>
                <p className="card-text">
                  After you play, check the high scores for each game — great for classrooms or
                  friendly competition.
                </p>
                <Link href="/leaderboard" className="btn-card">
                  View High Scores
                </Link>
              </article>

              <article className="card">
                <p className="card-step-label">Step 3</p>
                <h3 className="card-title">Need Help?</h3>
                <p className="card-text">
                  If you're not sure what to click, or have a problem, send us a message.
                </p>
                <Link href="/contact" className="btn-card">
                  Get Help
                </Link>
              </article>
            </div>
          </section>

          {/* GAME LIST */}
          <section id="games-list">
            <h2 className="section-heading">Pick a Game to Try</h2>
            <p className="section-sub">
              Start with any game below. Each game opens in a clean, full screen with simple
              controls and sound cues.
            </p>

            <div className="grid">
              {/* 2048 */}
              <article className="card">
                <img
                  className="card-img"
                  src="https://play2048.co/twitterImage.jpg"
                  alt="2048 preview"
                />
                <span className="badge">Good for beginners</span>
                <h3 className="card-title">2048</h3>
                <p className="card-text">
                  Merge tiles until you reach 2048 — slow-paced and great for beginners.
                </p>
                <Link href="/games/2048" className="btn-card">
                  Play 2048
                </Link>
              </article>

              {/* Snake */}
              <article className="card">
                <img
                  className="card-img"
                  src="https://www.fortressofsolitude.co.za/wp-content/uploads/2022/03/Google-Snake-Game-Easter-Egg-How-To-Play-Rules-Explained.jpeg"
                  alt="Snake preview"
                />
                <h3 className="card-title">Snake</h3>
                <p className="card-text">
                  Move the snake, collect points, avoid walls — with math challenges to keep going.
                </p>
                <Link href="/games/snake" className="btn-card">
                  Play Snake
                </Link>
              </article>

              {/* Bingo (now playable / placeholder) */}
              <article className="card">
                <img
                  className="card-img"
                  src="https://cdn.vectorstock.com/i/750p/65/40/vibrant-bingo-poster-vector-20026540.avif"
                  alt="Bingo preview"
                />
                <h3 className="card-title">Bingo</h3>
                <p className="card-text">
                  Classic number-matching bingo. This version is a simple prototype you can click
                  through while we build the full game.
                </p>
                <Link href="/games/bingo" className="btn-card">
                  Play Bingo
                </Link>
              </article>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">© 2025 Uncool Math Games | CIT 480 Project</footer>
    </div>
  );
}
