import React, { useState, useEffect } from "react";
import { CATS } from "../data/words";
import CatPicker from "./CatPicker";
import Empty from "./Empty";

// ── voice selection ──────────────────────────────────────────────
let voiceCache = null;
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.addEventListener("voiceschanged", () => { voiceCache = null; });
}

function getBestVoices() {
  if (voiceCache) return voiceCache;
  const all = window.speechSynthesis?.getVoices() || [];
  if (!all.length) return { en: null, ja: null };

  const score = v => {
    const n = v.name.toLowerCase();
    if (n.includes("google")) return 0;
    if (n.includes("premium") || n.includes("enhanced")) return 1;
    if (v.localService) return 2;
    return 3;
  };
  const best = lang =>
    [...all.filter(v => v.lang.startsWith(lang))].sort((a, b) => score(a) - score(b))[0] || null;

  voiceCache = { en: best("en"), ja: best("ja") };
  return voiceCache;
}

function speakQueue(items, voices) {
  if (!items.length) return;
  const synth = window.speechSynthesis;
  const [{ text, lang }, ...rest] = items;
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = 0.88;
  const voice = lang.startsWith("ja") ? voices?.ja : voices?.en;
  if (voice) utt.voice = voice;
  utt.onend = () => speakQueue(rest, voices);
  synth.speak(utt);
}

function speakCard(card) {
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const voices = getBestVoices();
  const items = [{ text: card.e, lang: "en-US" }, { text: card.j, lang: "ja-JP" }];
  if (card.x) items.push({ text: card.x, lang: "en-US" });
  if (card.xj) items.push({ text: card.xj, lang: "ja-JP" });
  speakQueue(items, voices);
}

// ── card ordering ────────────────────────────────────────────────
function sortedOrder(deck, progress) {
  const rank = s => s === "learning" ? 0 : !s ? 1 : 2;
  return deck.map((_, i) => i).sort((a, b) =>
    rank(progress[deck[a].e]?.status) - rank(progress[deck[b].e]?.status)
  );
}

function SpeakBtn({ card }) {
  return (
    <button
      className="speak-btn"
      onClick={e => { e.stopPropagation(); speakCard(card); }}
      title="音声再生"
    >🔊</button>
  );
}

// ── component ────────────────────────────────────────────────────
export default function Flash({ deck, cat, setCat, progress, mark }) {
  const [order, setOrder] = useState(() => sortedOrder(deck, progress));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setOrder(sortedOrder(deck, progress));
    setPos(0);
    setFlipped(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck]);

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

  const cardCls = ["card", flipped ? "flipped" : "", status ? "card-" + status : ""].filter(Boolean).join(" ");

  return (
    <div className="study">
      <div className="study-top">
        <CatPicker cat={cat} setCat={setCat} />
        <div className="study-meta">
          <span className="counter">{pos + 1} / {deck.length}</span>
          <button className="ghost" onClick={shuffle}>↻ シャッフル</button>
        </div>
      </div>

      <div className={cardCls} onClick={() => setFlipped((f) => !f)}>
        <div className="card-inner">
          <div className="card-face card-front">
            <span className="card-tab" style={{ background: meta.color }}>{meta.label}</span>
            {status && <span className={"badge " + status}>{status === "known" ? "習得" : "復習中"}</span>}
            <div className="word">{card.e}</div>
            <div className="tap-hint">タップで意味を表示</div>
            <SpeakBtn card={card} />
          </div>
          <div className="card-face card-back">
            <span className="card-tab" style={{ background: meta.color }}>{meta.label}</span>
            <div className="meaning">{card.j}</div>
            {card.x && (
              <div className="example">
                <span className="ex-en">{card.x}</span>
                {card.xj && <span className="ex-ja">{card.xj}</span>}
              </div>
            )}
            <div className="word-small">{card.e}</div>
            <SpeakBtn card={card} />
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
