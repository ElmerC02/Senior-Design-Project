"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Point = { x: number; y: number };
type PauseState = { snake: Point[]; score: number } | null;

const BOX = 20;
const WIDTH = 400;
const HEIGHT = 400;
const TICK_MS = 125;

/* ---------- audio ---------- */
let _ctx: AudioContext | null = null;
function ensureAudio(){
  if(!_ctx){
    const AC=(window as any).AudioContext || (window as any).webkitAudioContext;
    try{ _ctx=new AC(); }catch{}
  }
}
function tone(freq:number, ms=100, type:OscillatorType="square", gain=0.02){
  if(!_ctx) return;
  const t0=_ctx.currentTime;
  const o=_ctx.createOscillator(); const g=_ctx.createGain();
  o.type=type; o.frequency.value=freq;
  g.gain.setValueAtTime(0,t0);
  g.gain.linearRampToValueAtTime(gain,t0+0.01);
  g.gain.exponentialRampToValueAtTime(0.0001,t0+ms/1000);
  o.connect(g).connect(_ctx.destination);
  o.start(t0); o.stop(t0+ms/1000);
}
const sfx = {
  turn: ()=> tone(440,40,"triangle",0.012),
  eat: ()=> tone(720,120,"sine",0.03),
  die: ()=> { tone(200,220,"sawtooth",0.03); setTimeout(()=>tone(120,320,"sine",0.02),80); }
};

/* ---------- helpers ---------- */
function randomFood(): Point {
  return {
    x: Math.floor(Math.random() * (WIDTH / BOX)) * BOX,
    y: Math.floor(Math.random() * (HEIGHT / BOX)) * BOX,
  };
}
function collide(head: Point, body: Point[]) { return body.some(p => p.x===head.x && p.y===head.y); }

/* ---------- component ---------- */
export default function SnakePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loopRef = useRef<number | null>(null);

  const snakeRef = useRef<Point[]>([{ x: 9 * BOX, y: 10 * BOX }]);
  const dirRef = useRef<"LEFT" | "RIGHT" | "UP" | "DOWN">("RIGHT");
  const foodRef = useRef<Point>(randomFood());
  const scoreRef = useRef<number>(0);

  const [score, setScore] = useState(0);
  const [continueEnabled, setContinueEnabled] = useState(false);
  const pausedStateRef = useRef<PauseState>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [question, setQuestion] = useState("Solve: ?");
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");

//added -Jose (Calls API)
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const submitScore = useCallback(async (value: number) => {
    try {
      await fetch(`${API_BASE}/api/scores/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "testuser1@example.com", //uses test user
          displayName: "Test User 1", 
          code: "snake",
          value,
        }),
      });
      // console.log("Snake score submitted:", value);
    } catch (err) {
      console.error("Failed to submit snake score", err);
    }
  }, [API_BASE]);



  const reset = useCallback(() => {
    snakeRef.current = [{ x: 9 * BOX, y: 10 * BOX }];
    dirRef.current = "RIGHT";
    foodRef.current = randomFood();
    scoreRef.current = 0;
    setScore(0);
    setContinueEnabled(false);
    pausedStateRef.current = null;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;

    // clear
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // draw snake
    const snake = snakeRef.current;
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? "#0f0" : "#0a0";
      ctx.fillRect(snake[i].x, snake[i].y, BOX, BOX);
    }

    // draw food
    const food = foodRef.current; ctx.fillStyle = "#f00"; ctx.fillRect(food.x, food.y, BOX, BOX);

    // next head
    let headX = snake[0].x, headY = snake[0].y;
    const dir = dirRef.current;
    if (dir === "LEFT") headX -= BOX;
    if (dir === "RIGHT") headX += BOX;
    if (dir === "UP") headY -= BOX;
    if (dir === "DOWN") headY += BOX;

    // eat?
    if (headX === food.x && headY === food.y) {
      scoreRef.current += 1; setScore(scoreRef.current);
      foodRef.current = randomFood(); sfx.eat();
    } else {
      snake.pop();
    }

    const newHead = { x: headX, y: headY };

    // hit?
    const outOfBounds = headX < 0 || headX >= WIDTH || headY < 0 || headY >= HEIGHT;
    if (outOfBounds || collide(newHead, snake)) {
      const fullSnake = JSON.parse(JSON.stringify(snake));
      if (loopRef.current) window.clearInterval(loopRef.current); loopRef.current = null;
      setContinueEnabled(true);
      pausedStateRef.current = { snake: fullSnake, score: scoreRef.current };
      sfx.die();

      // Submit score to API -Jose (posts scores to DB using API)
      submitScore(scoreRef.current);

      return;
    }

    snake.unshift(newHead);
  }, []);

  const startLoop = useCallback(() => {
    if (loopRef.current) window.clearInterval(loopRef.current);
    loopRef.current = window.setInterval(draw, TICK_MS);
  }, [draw]);

  const init = useCallback(() => { reset(); startLoop(); }, [reset, startLoop]);

  // keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const key = e.key;
      const isArrow = ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(key);
      const isWasd = ["a","A","d","D","w","W","s","S"].includes(key);
      if (isArrow || isWasd) { e.preventDefault(); ensureAudio(); }

      const d = dirRef.current;
      if ((key === "ArrowLeft" || key === "a" || key === "A") && d !== "RIGHT") { dirRef.current = "LEFT"; sfx.turn(); }
      else if ((key === "ArrowUp" || key === "w" || key === "W") && d !== "DOWN") { dirRef.current = "UP"; sfx.turn(); }
      else if ((key === "ArrowRight" || key === "d" || key === "D") && d !== "LEFT") { dirRef.current = "RIGHT"; sfx.turn(); }
      else if ((key === "ArrowDown" || key === "s" || key === "S") && d !== "UP") { dirRef.current = "DOWN"; sfx.turn(); }
    }
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey as any);
  }, []);

  // touch
  useEffect(() => {
    let start: { x: number; y: number } | null = null;
    function onTouchStart(e: TouchEvent) { ensureAudio(); const t = e.touches[0]; start = { x: t.clientX, y: t.clientY }; }
    function onTouchEnd(e: TouchEvent) {
      if (!start) return;
      const t = e.changedTouches[0]; const dx = t.clientX - start.x; const dy = t.clientY - start.y; start = null;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      const d = dirRef.current;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && d !== "LEFT") { dirRef.current = "RIGHT"; sfx.turn(); }
        else if (dx < 0 && d !== "RIGHT") { dirRef.current = "LEFT"; sfx.turn(); }
      } else {
        if (dy > 0 && d !== "UP") { dirRef.current = "DOWN"; sfx.turn(); }
        else if (dy < 0 && d !== "DOWN") { dirRef.current = "UP"; sfx.turn(); }
      }
    }
    const el = canvasRef.current;
    if (el) {
      el.addEventListener("touchstart", onTouchStart, { passive: true });
      el.addEventListener("touchend", onTouchEnd, { passive: true });
    }
    return () => {
      if (el) {
        el.removeEventListener("touchstart", onTouchStart as any);
        el.removeEventListener("touchend", onTouchEnd as any);
      }
    };
  }, []);

  // mount
  useEffect(() => { init(); return () => { if (loopRef.current) window.clearInterval(loopRef.current); }; }, [init]);

  const onRestart = () => { ensureAudio(); init(); };

  // Continue flow — simple math modal
  function makeQuestion(){
    const ops = ["+","-","*","/"] as const;
    const op = ops[Math.floor(Math.random()*ops.length)];
    let a = Math.floor(Math.random()*10)+1, b = Math.floor(Math.random()*10)+1;
    if (op === "/") a = a * b;
    const map:{[k:string]:number} = { "+": a+b, "-": a-b, "*": a*b, "/": a/b };
    return { text: `Solve: ${a} ${op} ${b} = ?`, answer: map[op] };
  }
  const onContinue = () => {
    if (!pausedStateRef.current) return;
    const q = makeQuestion(); setQuestion(q.text); setCorrectAnswer(q.answer); setUserAnswer(""); setModalOpen(true);
    setTimeout(()=> (document.getElementById("answer-input") as HTMLInputElement | null)?.focus(), 0);
  };
  const checkAnswer = () => {
    const userVal = Number(userAnswer);
    if (correctAnswer !== null && userVal === correctAnswer) {
      setModalOpen(false);
      const state = pausedStateRef.current!;
      const centerX = 9 * BOX, centerY = 10 * BOX, len = state.snake.length;
      const rebuilt: Point[] = []; for (let i=0;i<len;i++) rebuilt.push({ x: centerX - i*BOX, y: centerY });
      snakeRef.current = rebuilt; dirRef.current = "RIGHT"; foodRef.current = randomFood();
      scoreRef.current = state.score; setScore(state.score); setContinueEnabled(false); startLoop();
    } else {
      alert("Incorrect answer! Try again."); setUserAnswer("");
      setTimeout(()=> (document.getElementById("answer-input") as HTMLInputElement | null)?.focus(), 0);
    }
  };

  return (
    <section>
      <h1 className="header">Snake</h1>
      <p className="sub">Arrow keys / WASD. Touch to swipe.</p>

      <div className="row m2">
        <div className="pill card"><span className="label">SCORE</span><span className="value">{score}</span></div>
        <button className="btn" onClick={onRestart}>Restart</button>
        <button className="btn" onClick={onContinue} disabled={!continueEnabled}>Continue</button>
      </div>

      <div className="card center" style={{ padding: 12 }}>
        <canvas
          ref={canvasRef}
          id="game"
          width={WIDTH}
          height={HEIGHT}
          style={{ border: "2px solid #0f0", background: "#000", width: "min(92vw, 400px)", height: "min(92vw, 400px)" }}
        />
      </div>

      {modalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>Answer to Continue</h2>
            <p>{question}</p>
            <input
              id="answer-input"
              className="card"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              style={{ width: "80%", height: 40, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", textAlign: "center", fontSize: 18, marginTop: 8 }}
            />
            <div className="row center" style={{ marginTop: 14 }}>
              <button className="btn" onClick={checkAnswer}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
