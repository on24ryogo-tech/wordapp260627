import React, { useState, useEffect } from "react";
import { CATS } from "../data/words";
import CatPicker from "./CatPicker";
import Empty from "./Empty";

export default function Flash({ deck, cat, setCat, progress, mark }) {
  const [order, setOrder] = useState(() => deck.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => { setOrder(deck.map((_, i) => i)); setPos(0); setFlipped(false); }, [deck]);

  if (deck.length === 0) return <Empty />;

  const idx = order[pos] ?? 0;
  const card = deck[idx];
  const meta = CATS[card.c];
  const status = progress[card.e]?.status;

  const next = () => { setFlipped(false); setPos((p) => (p + 1) % deck.length); };
  const prev = () => { setFlipped(false); setPos((p) => (p - 1 + deck.length) % deck.length); };
  const shuffle = () => {
    const a = deck.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    setOrder(a); setPos(0); setFlipped(false);
  };
  const handleMark = (s) => { mark(card.e, s); next(); };

  return (
    <div className="study">
      <div className="study-top">
        <CatPicker cat={cat} setCat={setCat} />
        <div className="study-meta">
          <span className="counter">{pos + 1} / {deck.length}</span>
          <button className="ghost" onClick={shuffle}>↻ シャッフル</button>
        </div>
      </div>

      <div className={flipped ? "card flipped" : "card"} onClick={() => setFlipped((f) => !f)}>
        <div className="card-inner">
          <div className="card-face card-front">
            <span className="card-tab" style={{ background: meta.color }}>{meta.label}</span>
            {status && <span className={"badge " + status}>{status === "known" ? "習得" : "復習中"}</span>}
            <div className="word">{card.e}</div>
            <div className="tap-hint">タップで意味を表示</div>
          </div>
          <div className="card-face card-back">
            <span className="card-tab" style={{ background: meta.color }}>{meta.label}</span>
            <div className="meaning">{card.j}</div>
            {card.x && <div className="example"><span className="ex-en">{card.x}</span></div>}
            <div className="word-small">{card.e}</div>
          </div>
        </div>
      </div>

      <div className="study-controls">
        <button className="ctrl" onClick={prev}>← 前へ</button>
        <button className="ctrl learn" onClick={() => handleMark("learning")}>要復習</button>
        <button className="ctrl know" onClick={() => handleMark("known")}>覚えた</button>
        <button className="ctrl" onClick={next}>次へ →</button>
      </div>
    </div>
  );
}
