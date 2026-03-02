"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number };

export default function SnakePage() {
  // Board settings
  const COLS = 20;
  const ROWS = 20;
  const CELL = 18; // px

  // Game state
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Snake + direction kept in refs for smooth interval updates
  const snakeRef = useRef<Point[]>([
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ]);

  const dirRef = useRef<Point>({ x: 1, y: 0 }); // moving right
  const nextDirRef = useRef<Point>({ x: 1, y: 0 });

  const foodRef = useRef<Point>({ x: 14, y: 10 });

  const tickRef = useRef<number | null>(null);

  // A “render key” to re-render grid from refs
  const [, force] = useState(0);

  const boardW = COLS * CELL;
  const boardH = ROWS * CELL;

  const neonShadow = useMemo(() => `0 0 10px rgba(57,255,20,.9), 0 0 30px rgba(57,255,20,.45)`, []);

  function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pointsEqual(a: Point, b: Point) {
    return a.x === b.x && a.y === b.y;
  }

  function spawnFood() {
    // Put food somewhere not on snake
    const snake = snakeRef.current;
    let tries = 0;

    while (tries < 5000) {
      const p = { x: randInt(0, COLS - 1), y: randInt(0, ROWS - 1) };
      if (!snake.some((s) => pointsEqual(s, p))) {
        foodRef.current = p;
        return;
      }
      tries++;
    }
  }

  function resetGame() {
    snakeRef.current = [
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 },
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
    setRunning(false);
    spawnFood();
    force((n) => n + 1);
  }

  function endGame() {
    setGameOver(true);
    setRunning(false);
  }

  function step() {
    // Lock in direction at start of tick (prevents instant reverse)
    dirRef.current = nextDirRef.current;

    const snake = snakeRef.current;
    const head = snake[0];
    const dir = dirRef.current;

    const newHead = { x: head.x + dir.x, y: head.y + dir.y };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
      endGame();
      return;
    }

    // Self collision
    if (snake.some((p) => pointsEqual(p, newHead))) {
      endGame();
      return;
    }

    // Move: add new head
    snake.unshift(newHead);

    // Eat food
    if (pointsEqual(newHead, foodRef.current)) {
      setScore((s) => s + 10);
      spawnFood();
      // Do NOT pop tail -> snake grows
    } else {
      // Remove tail -> normal movement
      snake.pop();
    }

    snakeRef.current = snake;

    // Force re-render
    force((n) => n + 1);
  }

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Start/Pause with Space
      if (key === " ") {
        e.preventDefault();
        if (!gameOver) setRunning((r) => !r);
        return;
      }

      const cur = dirRef.current;

      // helper: don't allow direct reverse
      const setDir = (d: Point) => {
        // If currently moving, forbid reversing into itself
        if (cur.x === -d.x && cur.y === -d.y) return;
        nextDirRef.current = d;
      };

      if (key === "arrowup" || key === "w") setDir({ x: 0, y: -1 });
      if (key === "arrowdown" || key === "s") setDir({ x: 0, y: 1 });
      if (key === "arrowleft" || key === "a") setDir({ x: -1, y: 0 });
      if (key === "arrowright" || key === "d") setDir({ x: 1, y: 0 });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameOver]);

  // Game loop
  useEffect(() => {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }

    if (running && !gameOver) {
      // speed: lower = faster
      tickRef.current = window.setInterval(step, 120);
    }

    return () => {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [running, gameOver]);

  // Initialize food once
  useEffect(() => {
    spawnFood();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const snake = snakeRef.current;
  const food = foodRef.current;

  return (
    <main style={{ padding: "24px 16px" }}>
      <style>{`
        .wrap {
          max-width: 980px;
          margin: 0 auto;
        }

        .neonShell {
          background: radial-gradient(circle at 50% 20%, #0f0f0f, #000);
          border: 2px solid rgba(57,255,20,.85);
          box-shadow: 0 0 15px rgba(57,255,20,.9), 0 0 55px rgba(57,255,20,.25);
          border-radius: 18px;
          padding: 18px;
        }

        .title {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          letter-spacing: 3px;
          font-weight: 900;
          font-size: 42px;
          text-align: center;
          margin: 8px 0 12px;
          color: #39FF14;
          text-shadow: 0 0 12px rgba(57,255,20,.95), 0 0 30px rgba(57,255,20,.35);
        }

        .barRow {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .scoreBar {
          min-width: 260px;
          padding: 10px 14px;
          text-align: center;
          background: #000;
          border: 2px solid rgba(57,255,20,.85);
          border-radius: 12px;
          color: #39FF14;
          font-weight: 800;
          box-shadow: inset 0 0 10px rgba(57,255,20,.45);
        }

        .btnRow {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .btn {
          background: #000;
          color: #39FF14;
          border: 2px solid rgba(57,255,20,.85);
          padding: 10px 16px;
          border-radius: 12px;
          font-weight: 900;
          cursor: pointer;
          transition: transform .12s ease, box-shadow .2s ease, background .2s ease, color .2s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 14px rgba(57,255,20,.55);
          background: #39FF14;
          color: #000;
        }

        .hint {
          text-align: center;
          margin-top: 10px;
          color: rgba(57,255,20,.75);
          font-weight: 700;
        }

        .board {
          margin: 0 auto;
          background: #000;
          border: 3px solid rgba(57,255,20,.85);
          border-radius: 14px;
          box-shadow: 0 0 20px rgba(57,255,20,.35);
          position: relative;
          overflow: hidden;
        }

        .cell {
          position: absolute;
          width: ${CELL}px;
          height: ${CELL}px;
          border-radius: 6px;
        }

        .snakeHead {
          background: #39FF14;
          box-shadow: 0 0 12px rgba(57,255,20,.9);
        }

        .snakeBody {
          background: rgba(57,255,20,.75);
          box-shadow: 0 0 10px rgba(57,255,20,.45);
        }

        .food {
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(255,255,255,.85);
        }

        .overlay {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(0,0,0,.55);
          backdrop-filter: blur(2px);
        }

        .overlayCard {
          background: #000;
          border: 2px solid rgba(57,255,20,.85);
          border-radius: 14px;
          padding: 16px;
          width: min(92%, 420px);
          text-align: center;
          box-shadow: 0 0 18px rgba(57,255,20,.45);
          color: #39FF14;
        }

        .overlayCard h2 {
          margin: 0 0 8px;
          letter-spacing: 2px;
          text-shadow: 0 0 10px rgba(57,255,20,.85);
        }

        .overlayCard p {
          margin: 0 0 12px;
          opacity: .9;
          color: rgba(57,255,20,.85);
        }
      `}</style>

      <div className="wrap">
        <div className="neonShell">
          <div className="title">Enhance SNAKE</div>

          <div className="barRow">
            <div className="scoreBar">Score: {score}</div>
          </div>

          <div
            className="board"
            style={{
              width: boardW,
              height: boardH,
              boxShadow: neonShadow,
            }}
          >
            {/* Snake */}
            {snake.map((p, i) => (
              <div
                key={`${p.x}-${p.y}-${i}`}
                className={`cell ${i === 0 ? "snakeHead" : "snakeBody"}`}
                style={{
                  left: p.x * CELL,
                  top: p.y * CELL,
                }}
              />
            ))}

            {/* Food */}
            <div
              className="cell food"
              style={{
                left: food.x * CELL,
                top: food.y * CELL,
              }}
            />

            {/* Game Over overlay */}
            {gameOver && (
              <div className="overlay">
                <div className="overlayCard">
                  <h2>Game Over</h2>
                  <p>Your score: {score}</p>
                  <button className="btn" onClick={resetGame}>
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="btnRow">
            <button
              className="btn"
              onClick={() => {
                if (gameOver) return;
                setRunning(true);
              }}
              disabled={running || gameOver}
              style={{ opacity: running || gameOver ? 0.6 : 1 }}
            >
              Start
            </button>

            <button
              className="btn"
              onClick={() => setRunning((r) => !r)}
              disabled={gameOver}
              style={{ opacity: gameOver ? 0.6 : 1 }}
            >
              {running ? "Pause" : "Resume"}
            </button>

            <button className="btn" onClick={resetGame}>
              Reset
            </button>
          </div>

          <div className="hint">Controls: Arrow Keys / WASD • Space = Pause/Resume</div>
        </div>
      </div>
    </main>
  );
}
