"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Board = number[][];
const SIZE = 4;

/* ---------- audio (Web Audio tiny sfx) ---------- */
let _ctx: AudioContext | null = null;
function ensureAudio() {
  if (!_ctx) {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    try { _ctx = new AC(); } catch {}
  }
}
function tone(freq: number, ms = 100, type: OscillatorType = "sine", gain = 0.02) {
  if (!_ctx) return;
  const t0 = _ctx.currentTime;
  const o = _ctx.createOscillator();
  const g = _ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms / 1000);
  o.connect(g).connect(_ctx.destination);
  o.start(t0); o.stop(t0 + ms / 1000);
}
const sfx = {
  move: () => tone(240, 40, "square", 0.01),
  merge: () => tone(420, 120, "triangle", 0.03),
  newTile: () => tone(320, 70, "sine", 0.015),
  over: () => { tone(140, 250, "sawtooth", 0.02); setTimeout(() => tone(110, 300, "sine", 0.02), 60); }
};

/* ---------- helpers ---------- */
function emptyBoard(): Board { return Array.from({ length: SIZE }, () => Array(SIZE).fill(0)); }
function clone(b: Board): Board { return b.map((r) => r.slice()); }
function randomEmptyCell(b: Board): [number, number] | null {
  const empty: Array<[number, number]> = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (b[r][c] === 0) empty.push([r, c]);
  if (!empty.length) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}
function addRandomTile(b: Board) { const s = randomEmptyCell(b); if (!s) return; const [r,c]=s; b[r][c] = Math.random() < 0.9 ? 2 : 4; }
function rotateRight(b: Board): Board { const n=SIZE,out=emptyBoard(); for(let r=0;r<n;r++)for(let c=0;c<n;c++)out[c][n-1-r]=b[r][c]; return out; }
function slideRowLeft(row: number[]): { row: number[]; gained: number } {
  const filtered = row.filter(v => v!==0); const out:number[]=[]; let gained=0;
  for (let i=0;i<filtered.length;i++){
    if (filtered[i]===filtered[i+1]){ const val=filtered[i]*2; out.push(val); gained+=val; i++; }
    else out.push(filtered[i]);
  }
  while(out.length<SIZE) out.push(0); return {row:out,gained};
}
function slideLeft(b: Board){ let moved=false,gained=0;
  const next=b.map(row=>{const before=row.join(","); const {row:slid,gained:g}=slideRowLeft(row); gained+=g; if(before!==slid.join(",")) moved=true; return slid;});
  return { next, moved, gained };
}
function move(b: Board, dir:"left"|"right"|"up"|"down"){
  let work=clone(b);
  if(dir==="up") work=rotateRight(rotateRight(rotateRight(work)));
  if(dir==="right") work=rotateRight(rotateRight(work));
  if(dir==="down") work=rotateRight(work);
  const {next,moved,gained}=slideLeft(work);
  let out=next;
  if(dir==="up") out=rotateRight(out);
  if(dir==="right") out=rotateRight(rotateRight(out));
  if(dir==="down") out=rotateRight(rotateRight(rotateRight(out)));
  return { out, moved, gained };
}
function hasMoves(b: Board){
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++) if(b[r][c]===0) return true;
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){ const v=b[r][c]; if(r+1<SIZE && b[r+1][c]===v) return true; if(c+1<SIZE && b[r][c+1]===v) return true; }
  return false;
}
function tileStyle(v:number): React.CSSProperties{
  if(v===0) return { background: "#f1f3f9", color:"#8b95a6" };
  const level=Math.log2(v), hue=220-Math.min(170, level*18), light=70-Math.min(26, Math.max(0, level-2)*3.2);
  const text=v<=8?"#14203a":"white";
  return { background:`linear-gradient(180deg, hsl(${hue} 80% ${light+6}%), hsl(${hue} 80% ${light}%))`, color:text, boxShadow:"inset 0 1px 0 rgba(255,255,255,.55)" };
}

/* ---------- component ---------- */
export default function Game2048Page(){
  const [board,setBoard]=useState<Board>(emptyBoard);
  const [score,setScore]=useState(0);
  const [best,setBest]=useState(0);
  const [over,setOver]=useState(false);
  const newTileFlag=useRef<string>("");

  useEffect(()=>{ // mount
    try { const saved = Number(localStorage.getItem("umg_best_2048")||0); if(!Number.isNaN(saved)) setBest(saved);} catch{}
    const b=emptyBoard(); addRandomTile(b); addRandomTile(b); setBoard(b);
  },[]);

  const updateBest = useCallback((n:number)=>{ if(n>best){ setBest(n); try{ localStorage.setItem("umg_best_2048", String(n)); }catch{} } },[best]);

  const doMove = useCallback((dir:"left"|"right"|"up"|"down")=>{
    if (over) return;
    ensureAudio();
    const {out,moved,gained} = move(board, dir);
    if (!moved) return;
    sfx.move();
    if (gained>0) sfx.merge();
    addRandomTile(out); newTileFlag.current = JSON.stringify(out); sfx.newTile();
    setBoard(out);
    const next = score + gained; setScore(next); updateBest(next);
    if (!hasMoves(out)){ setOver(true); sfx.over(); }
  },[board,score,over,updateBest]);

  const reset = useCallback(()=>{ const b=emptyBoard(); addRandomTile(b); addRandomTile(b); setBoard(b); setScore(0); setOver(false); },[]);

  useEffect(()=>{ // keyboard
    function onKey(e: KeyboardEvent){
      const isArrow=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key);
      const isWasd=["a","A","d","D","w","W","s","S"].includes(e.key);
      if(isArrow||isWasd){ e.preventDefault(); ensureAudio(); }
      if(["ArrowLeft","a","A"].includes(e.key)) return doMove("left");
      if(["ArrowRight","d","D"].includes(e.key)) return doMove("right");
      if(["ArrowUp","w","W"].includes(e.key)) return doMove("up");
      if(["ArrowDown","s","S"].includes(e.key)) return doMove("down");
    }
    window.addEventListener("keydown", onKey, { passive:false });
    return ()=> window.removeEventListener("keydown", onKey as any);
  },[doMove]);

  // touch swipe
  const start = useRef<{x:number,y:number}|null>(null);
  const onTouchStart=(e:React.TouchEvent)=>{ ensureAudio(); const t=e.touches[0]; start.current={x:t.clientX,y:t.clientY}; };
  const onTouchEnd=(e:React.TouchEvent)=>{ if(!start.current) return; const t=e.changedTouches[0]; const dx=t.clientX-start.current.x; const dy=t.clientY-start.current.y; start.current=null; if(Math.abs(dx)<24 && Math.abs(dy)<24) return; if(Math.abs(dx)>Math.abs(dy)) doMove(dx>0?"right":"left"); else doMove(dy>0?"down":"up"); };

  return (
    <section>
      <h1 className="header">2048</h1>
      <p className="sub">Use ← → ↑ ↓ or WASD. Swipe on mobile.</p>

      <div className="row m2">
        <div className="pill card"><span className="label">SCORE</span><span className="value">{score}</span></div>
        <div className="pill card"><span className="label">BEST</span><span className="value">{best}</span></div>
        <button className="btn" onClick={()=>{ ensureAudio(); reset(); }}>New Game</button>
      </div>

      <div className="board card" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {board.map((row,r)=> row.map((val,c)=>{
          const key=`${r}-${c}-${val}-${newTileFlag.current.length}`;
          return <div key={key} className={`tile ${val!==0?"appear":""}`} style={tileStyle(val)}>{val||""}</div>;
        }))}
      </div>

      {over && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Game over">
          <div className="modal">
            <h2>Game Over</h2>
            <p>Your score: <strong>{score}</strong> • Best: <strong>{best}</strong></p>
            <div className="row center"><button className="btn" onClick={()=>{ ensureAudio(); reset(); }}>Try Again</button></div>
          </div>
        </div>
      )}
    </section>
  );
}
