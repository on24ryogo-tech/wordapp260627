import React, { useState, useEffect } from "react";
import { CATS } from "../data/words";
import CatPicker from "./CatPicker";
import Empty from "./Empty";

// ── audio key (must match scripts/gen-audio.mjs) ────────────────
function toKey(str) {
  return str
    .replace(/β/g, 'beta').replace(/α/g, 'alpha').replace(/γ/g, 'gamma')
    .replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '')
    .toLowerCase().slice(0, 80);
}

// ── playback engine ──────────────────────────────────────────────
let currentAudioEl = null;
let playId = 0;

function stopAll() {
  playId++;
  if (currentAudioEl) { currentAudioEl.pause(); currentAudioEl = null; }
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

let voiceCache = null;
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.addEventListener("voiceschanged", () => { voiceCache = null; });
}
function getBestVoices() {
  if (voiceCache) return voiceCache;
  const all = window.speechSynthesis?.getVoices() || [];
  if (!all.length) return { en: null, ja: null };
  const score = v => { const n = v.name.toLowerCase(); return n.includes("google") ? 0 : n.includes("premium") || n.includes("enhanced") ? 1 : v.localService ? 2 : 3; };
  const best = lang => [...all.filter(v => v.lang.startsWith(lang))].sort((a, b) => score(a) - score(b))[0] || null;
  voiceCache = { en: best("en"), ja: best("ja") };
  return voiceCache;
}

function ttsSpeak(id, items, speed, onDone) {
  if (id !== playId) return;
  if (!items.length) { if (onDone) onDone(); return; }
  const [{ text, lang }, ...rest] = items;
  const synth = window.speechSynthesis;
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = 0.88 * speed;
  const v = getBestVoices();
  if (lang.startsWith("ja") ? v?.ja : v?.en) utt.voice = lang.startsWith("ja") ? v.ja : v.en;
  utt.onend = () => ttsSpeak(id, rest, speed, onDone);
  synth.speak(utt);
}

function playAudioSequence(id, srcs, fallbackItems, speed, onDone) {
  if (id !== playId) return;
  if (!srcs.length) { ttsSpeak(id, fallbackItems, speed, onDone); return; }
  const [first, ...rest] = srcs;
  const a = new Audio(first);
  a.playbackRate = speed;
  currentAudioEl = a;
  a.onended = () => playAudioSequence(id, rest, [], speed, onDone);
  a.onerror = () => { if (id === playId) ttsSpeak(id, fallbackItems, speed, onDone); };
  a.play().catch(() => { if (id === playId) ttsSpeak(id, fallbackItems, speed, onDone); });
}

// ── card ordering ─────────────────────────────────────────────────
function sortedOrder(deck, progress) {
  const rank = s => s === "learning" ? 0 : !s ? 1 : 2;
  return deck.map((_, i) => i).sort((a, b) =>
    rank(progress[deck[a].e]?.status) - rank(progress[deck[b].e]?.status)
  );
}

// ── component ────────────────────────────────────────────────────
export default function Flash({ deck, cat, setCat, progress, mark }) {
  const [order, setOrder] = useState(() => sortedOrder(deck, progress));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  useEffect(() => {
    stopAll();
    setPlaying(false);
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

  function stopAudio() { stopAll(); setPlaying(false); }

  function handleSpeak(c) {
    if (playing) { stopAudio(); return; }
    const k = toKey(c.e);
    const base = process.env.PUBLIC_URL || '';
    const srcs = [`${base}/audio/${k}-word.mp3`, `${base}/audio/${k}-ja.mp3`];
    if (c.x)  srcs.push(`${base}/audio/${k}-ex.mp3`);
    if (c.xj) srcs.push(`${base}/audio/${k}-xj.mp3`);
    const fallback = [{ text: c.e, lang: "en-US" }, { text: c.j, lang: "ja-JP" }];
    if (c.x)  fallback.push({ text: c.x, lang: "en-US" });
    if (c.xj) fallback.push({ text: c.xj, lang: "ja-JP" });
    setPlaying(true);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const id = ++playId;
    playAudioSequence(id, srcs, fallback, speed, () => setPlaying(false));
  }

  const next = () => { stopAudio(); setFlipped(false); setPos((p) => (p + 1) % deck.length); };
  const prev = () => { stopAudio(); setFlipped(false); setPos((p) => (p - 1 + deck.length) % deck.length); };
  const shuffle = () => {
    stopAudio();
    const a = deck.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    setOrder(a); setPos(0); setFlipped(false);
  };
  const handleMark = (s) => { mark(card.e, s); next(); };
  const cardCls = ["card", flipped ? "flipped" : "", status ? "card-" + status : ""].filter(Boolean).join(" ");
  const speakCls = "speak-btn" + (playing ? " active" : "");

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
            <button className={speakCls} onClick={e => { e.stopPropagation(); handleSpeak(card); }} title={playing ? "停止" : "音声再生"}>
              {playing ? "⏹" : "🔊"}
            </button>
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
            <button className={speakCls} onClick={e => { e.stopPropagation(); handleSpeak(card); }} title={playing ? "停止" : "音声再生"}>
              {playing ? "⏹" : "🔊"}
            </button>
          </div>
        </div>
      </div>
      <div className="speed-ctrl">
        {[0.75, 1, 1.5, 2].map(s => (
          <button key={s} className={"spd-btn" + (speed === s ? " spd-on" : "")} onClick={() => setSpeed(s)}>
            {s}×
          </button>
        ))}
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
