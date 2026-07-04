import React, { useState, useEffect, useCallback, useRef } from "react";
import { CATS, DATA } from "../data/words";
import { playWord } from "../lib/audio";
import CatPicker from "./CatPicker";
import Empty from "./Empty";

function weightedPick(deck, progress) {
  const weights = deck.map(d => {
    const p = progress[d.e];
    if (!p || !p.status) return 2;
    if (p.status === "learning") return 5;
    const total = (p.correct || 0) + (p.incorrect || 0);
    if (total === 0) return 2;
    const acc = p.correct / total;
    if (acc < 0.5) return 4;
    if (p.status === "known" && acc >= 0.8) return 1;
    return 2;
  });
  const sum = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * sum;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return deck[i];
  }
  return deck[deck.length - 1];
}

// mode: "mix"（英⇄日4択） | "listen"（音声→意味4択）
function makeQuestion(deck, pool, progress, mode) {
  const q = weightedPick(deck, progress);
  const askEnToJa = mode === "listen" ? true : Math.random() < 0.5;
  const opts = new Set([askEnToJa ? q.j : q.e]);
  let guard = 0;
  while (opts.size < 4 && guard < 200) {
    const r = pool[Math.floor(Math.random() * pool.length)];
    opts.add(askEnToJa ? r.j : r.e);
    guard++;
  }
  const arr = Array.from(opts);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return { q, askEnToJa, options: arr, answer: askEnToJa ? q.j : q.e };
}

const MODES = [
  { id: "mix",    label: "4択" },
  { id: "listen", label: "🎧 リスニング" },
];

export default function Quiz({ deck, cat, setCat, markQuiz, progress }) {
  const pool = DATA;
  const [mode, setMode]     = useState("mix");
  const [qst, setQst]       = useState(null);
  const [picked, setPicked] = useState(null);
  const [score, setScore]   = useState({ right: 0, total: 0 });
  const stopRef = useRef(null);

  const stopAudio = () => { if (stopRef.current) { stopRef.current(); stopRef.current = null; } };

  const speak = useCallback((word) => {
    stopAudio();
    stopRef.current = playWord(word, { onDone: () => { stopRef.current = null; } });
  }, []);

  const newQ = useCallback(() => {
    if (deck.length < 2) { setQst(null); return; }
    stopAudio();
    setPicked(null);
    const next = makeQuestion(deck, pool, progress, mode);
    setQst(next);
    if (mode === "listen") speak(next.q.e);
  }, [deck, pool, progress, mode, speak]);

  const newQRef = useRef(newQ);
  newQRef.current = newQ;

  useEffect(() => { setScore({ right: 0, total: 0 }); newQRef.current(); }, [deck, mode]);
  useEffect(() => () => stopAudio(), []); // unmount時に音声停止

  if (deck.length < 4) return <Empty msg="クイズには各品詞で4語以上が必要です。「すべて」か別の品詞を選んでください。" cat={cat} setCat={setCat} />;
  if (!qst) return <Empty />;

  const choose = (opt) => {
    if (picked) return;
    setPicked(opt);
    const correct = opt === qst.answer;
    setScore((s) => ({ right: s.right + (correct ? 1 : 0), total: s.total + 1 }));
    markQuiz(qst.q.e, correct);
  };

  const meta = CATS[qst.q.c];
  const isListen = mode === "listen";

  return (
    <div className="study">
      <div className="study-top">
        <CatPicker cat={cat} setCat={setCat} />
        <div className="study-meta">
          <div className="quiz-modes">
            {MODES.map(m => (
              <button key={m.id}
                className={"stab" + (mode === m.id ? " stab-on" : "")}
                onClick={() => setMode(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
          <span className="counter">スコア {score.right} / {score.total}</span>
        </div>
      </div>

      <div className="quiz">
        <div className="quiz-prompt">
          <span className="card-tab" style={{ background: meta.color }}>{meta.label}</span>
          <p className="quiz-label">
            {isListen ? "聞こえた語の意味は？" : qst.askEnToJa ? "この語の意味は？" : "この意味の英語は？"}
          </p>
          {isListen ? (
            <div className="quiz-listen">
              {picked
                ? <div className="quiz-q">{qst.q.e}</div>
                : <button className="listen-btn" onClick={() => speak(qst.q.e)} title="もう一度再生">🔊</button>}
              {!picked && <p className="listen-hint">タップで再生</p>}
            </div>
          ) : (
            <div className="quiz-q">{qst.askEnToJa ? qst.q.e : qst.q.j}</div>
          )}
        </div>

        <div className="quiz-options">
          {qst.options.map((opt) => {
            let cls = "opt";
            if (picked) {
              if (opt === qst.answer) cls += " correct";
              else if (opt === picked) cls += " wrong";
              else cls += " dim";
            }
            return (
              <button key={opt} className={cls} onClick={() => choose(opt)}>{opt}</button>
            );
          })}
        </div>

        {picked && (
          <div className="quiz-foot">
            {qst.q.x && <p className="quiz-ex">{qst.q.x}</p>}
            {qst.q.xj && <p className="quiz-xj">{qst.q.xj}</p>}
            <button className="cta cta-primary" onClick={newQ}>次の問題 →</button>
          </div>
        )}
      </div>
    </div>
  );
}
