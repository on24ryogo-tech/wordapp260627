import React, { useState, useEffect, useMemo } from "react";
import { CATS } from "../data/words";
import { WIKI_ARTICLES } from "../data/images";
import CatPicker from "./CatPicker";
import Empty from "./Empty";

// ── audio key ────────────────────────────────────────────────────
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

function ttsSpeak(id, items, spd, onDone) {
  if (id !== playId) return;
  if (!items.length) { if (onDone) onDone(); return; }
  const [{ text, lang }, ...rest] = items;
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = 0.88 * spd;
  const v = getBestVoices();
  utt.voice = (lang.startsWith("ja") ? v?.ja : v?.en) || null;
  utt.onend = () => ttsSpeak(id, rest, spd, onDone);
  window.speechSynthesis.speak(utt);
}

function playSeq(id, srcs, fallback, spd, onDone) {
  if (id !== playId) return;
  if (!srcs.length) { ttsSpeak(id, fallback, spd, onDone); return; }
  const [first, ...rest] = srcs;
  const a = new Audio(first);
  a.playbackRate = spd;
  currentAudioEl = a;
  a.onended = () => playSeq(id, rest, [], spd, onDone);
  a.onerror  = () => { if (id === playId) ttsSpeak(id, fallback, spd, onDone); };
  a.play().catch(() => { if (id === playId) ttsSpeak(id, fallback, spd, onDone); });
}

// ── SRP sort ─────────────────────────────────────────────────────
function localDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function srpSort(cards, progress) {
  const today = localDateStr();
  const rank = p => {
    if (!p?.status) return 1;
    if (p.status === "learning") return 0;
    if (p.nextReview && p.nextReview <= today) return 0;
    return 2;
  };
  return [...cards].sort((a, b) => {
    const ra = rank(progress[a.e]);
    const rb = rank(progress[b.e]);
    if (ra !== rb) return ra - rb;
    // rank=2（習得済・期限外）内: nextReview降順 → 最近やったもの（短い間隔）を末尾へ
    if (ra === 2) {
      const na = progress[a.e]?.nextReview || '';
      const nb = progress[b.e]?.nextReview || '';
      if (na > nb) return -1;
      if (na < nb) return 1;
    }
    return 0;
  });
}

// ── Wikipedia pageimages API (CORS対応・キャッシュ付き) ──────────
// action API は summary より多くのページで画像を返す
const _wikiCache = {};

function CardImage({ word }) {
  const article = WIKI_ARTICLES[word];
  const [st, setSt] = useState({ s: 'idle' }); // s: 'idle'|'ok'|'fail'

  useEffect(() => {
    if (!article) return;
    const hit = _wikiCache[article];
    if (hit === 'x') { setSt({ s: 'fail' }); return; }
    if (hit)         { setSt({ s: 'ok', src: hit.src, credit: hit.credit }); return; }
    setSt({ s: 'idle' }); // リセット（カード切替時に前の画像を消す）

    let alive = true;
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(article)}&prop=pageimages&format=json&pithumbsize=320&origin=*`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (!alive) return;
        const page = Object.values(d.query?.pages || {})[0];
        if (page?.thumbnail?.source) {
          const c = { src: page.thumbnail.source, credit: page.title };
          _wikiCache[article] = c;
          setSt({ s: 'ok', ...c });
        } else { _wikiCache[article] = 'x'; setSt({ s: 'fail' }); }
      })
      .catch(() => { if (alive) { _wikiCache[article] = 'x'; setSt({ s: 'fail' }); } });
    return () => { alive = false; };
  }, [article]);

  if (!article || st.s !== 'ok') return null;
  return (
    <div className="card-img-wrap">
      <img src={st.src} alt={article} className="card-img"
        onError={() => setSt({ s: 'fail' })} />
      <div className="card-img-credit">Wikipedia: <em>{st.credit}</em> / CC BY-SA</div>
    </div>
  );
}

// ── status tabs config ────────────────────────────────────────────
const TABS = [
  { id: "all",      label: "すべて" },
  { id: "learning", label: "復習中" },
  { id: "unseen",   label: "未学習" },
  { id: "known",    label: "習得済" },
];

// ── component ────────────────────────────────────────────────────
export default function Flash({ deck, cat, setCat, progress, mark }) {
  const [tab, setTab]           = useState("all");
  const [cards, setCards]       = useState(() => srpSort(deck, progress));
  const [pos, setPos]           = useState(0);
  const [flipped, setFlipped]   = useState(false);
  const [playing, setPlaying]   = useState(false);
  const [speed, setSpeed]       = useState(1.0);

  // Live counts for tab badges (updates as progress changes)
  const counts = useMemo(() => ({
    all:      deck.length,
    learning: deck.filter(d => progress[d.e]?.status === "learning").length,
    unseen:   deck.filter(d => !progress[d.e]?.status).length,
    known:    deck.filter(d => progress[d.e]?.status === "known").length,
  }), [deck, progress]);

  // Rebuild card list when category or tab changes (NOT on progress change — stable session)
  useEffect(() => {
    stopAll();
    setPlaying(false);
    let filtered = deck;
    if (tab === "learning") filtered = deck.filter(d => progress[d.e]?.status === "learning");
    else if (tab === "known")   filtered = deck.filter(d => progress[d.e]?.status === "known");
    else if (tab === "unseen")  filtered = deck.filter(d => !progress[d.e]?.status);
    setCards(srpSort(filtered, progress));
    setPos(0);
    setFlipped(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, tab]);

  // Helper: build audio srcs + TTS fallback for a card
  function buildAudio(c) {
    const k = toKey(c.e);
    const base = process.env.PUBLIC_URL || '';
    const srcs = [`${base}/audio/${k}-word.mp3`, `${base}/audio/${k}-ja.mp3`];
    if (c.x)  srcs.push(`${base}/audio/${k}-ex.mp3`);
    if (c.xj) srcs.push(`${base}/audio/${k}-xj.mp3`);
    const fb = [{ text: c.e, lang: "en-US" }, { text: c.j, lang: "ja-JP" }];
    if (c.x)  fb.push({ text: c.x, lang: "en-US" });
    if (c.xj) fb.push({ text: c.xj, lang: "ja-JP" });
    return { srcs, fb };
  }

  function startPlay(c, spd) {
    const { srcs, fb } = buildAudio(c);
    setPlaying(true);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const id = ++playId;
    playSeq(id, srcs, fb, spd, () => setPlaying(false));
  }

  function stopAudio() { stopAll(); setPlaying(false); }

  const safePos = Math.min(pos, Math.max(0, cards.length - 1));

  // No cards in this tab
  if (cards.length === 0) return (
    <div className="study">
      <div className="study-top">
        <CatPicker cat={cat} setCat={setCat} />
        <TabRow tab={tab} setTab={setTab} counts={counts} cardsLen={0} pos={0} onShuffle={null} />
      </div>
      <Empty />
    </div>
  );

  const card   = cards[safePos];
  const meta   = CATS[card.c];
  const status = progress[card.e]?.status;

  function handleSpeak() {
    if (playing) { stopAudio(); return; }
    startPlay(card, speed);
  }

  function handleSpeed(s) {
    setSpeed(s);
    if (playing) { stopAll(); startPlay(card, s); } // restart at new speed
  }

  const next = () => { stopAudio(); setFlipped(false); setPos(p => (p + 1) % cards.length); };
  const prev = () => { stopAudio(); setFlipped(false); setPos(p => (p - 1 + cards.length) % cards.length); };

  const shuffle = () => {
    stopAudio();
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCards(shuffled);
    setPos(0);
    setFlipped(false);
  };

  const handleMark = s => { mark(card.e, s); next(); };
  const cardCls  = ["card", flipped ? "flipped" : "", status ? "card-" + status : ""].filter(Boolean).join(" ");
  const speakCls = "speak-btn" + (playing ? " active" : "");

  return (
    <div className="study">
      <div className="study-top">
        <CatPicker cat={cat} setCat={setCat} />
        <TabRow tab={tab} setTab={setTab} counts={counts} cardsLen={cards.length} pos={safePos} onShuffle={shuffle} />
      </div>

      <div className={cardCls} onClick={() => setFlipped(f => !f)}>
        <div className="card-inner">
          <div className="card-face card-front">
            <span className="card-tab" style={{ background: meta.color }}>{meta.label}</span>
            {status && <span className={"badge " + status}>{status === "known" ? "習得" : "復習中"}</span>}
            <div className="word">{card.e}</div>
            <div className="tap-hint">タップで意味を表示</div>
            <button className={speakCls} onClick={e => { e.stopPropagation(); handleSpeak(); }} title={playing ? "停止" : "音声再生"}>
              {playing ? "⏹" : "🔊"}
            </button>
          </div>
          <div className="card-face card-back">
            <span className="card-tab" style={{ background: meta.color }}>{meta.label}</span>
            <div className="meaning">{card.j}</div>
            <CardImage word={card.e} />
            {card.x && (
              <div className="example">
                <span className="ex-en">{card.x}</span>
                {card.xj && <span className="ex-ja">{card.xj}</span>}
              </div>
            )}
            <div className="word-small">{card.e}</div>
            <button className={speakCls} onClick={e => { e.stopPropagation(); handleSpeak(); }} title={playing ? "停止" : "音声再生"}>
              {playing ? "⏹" : "🔊"}
            </button>
          </div>
        </div>
      </div>

      <div className="speed-ctrl">
        {[0.75, 1, 1.5, 2].map(s => (
          <button key={s} className={"spd-btn" + (speed === s ? " spd-on" : "")} onClick={() => handleSpeed(s)}>
            {s}×
          </button>
        ))}
      </div>

      <div className="study-controls">
        <button className="ctrl" onClick={prev}>← 前へ</button>
        <button className="ctrl learn" onClick={() => handleMark("learning")}>要復習</button>
        <button className="ctrl know"  onClick={() => handleMark("known")}>覚えた</button>
        <button className="ctrl" onClick={next}>次へ →</button>
      </div>
    </div>
  );
}

// ── tab + meta row ────────────────────────────────────────────────
function TabRow({ tab, setTab, counts, cardsLen, pos, onShuffle }) {
  return (
    <div className="flash-tab-row">
      <div className="flash-tabs">
        {TABS.map(t => (
          <button key={t.id}
            className={"stab" + (tab === t.id ? " stab-on" : "")}
            onClick={() => setTab(t.id)}>
            {t.label}<span className="stab-ct"> {counts[t.id]}</span>
          </button>
        ))}
      </div>
      <div className="flash-meta">
        <span className="counter">{cardsLen > 0 ? `${pos + 1} / ${cardsLen}` : "0 / 0"}</span>
        {onShuffle && <button className="ghost icon-btn" onClick={onShuffle} title="シャッフル">↻</button>}
      </div>
    </div>
  );
}
