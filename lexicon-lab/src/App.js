import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DATA } from "./data/words";
import Style from "./components/Style";
import Home from "./components/Home";
import Flash from "./components/Flash";
import Quiz from "./components/Quiz";
import Browse from "./components/Browse";

const STORE_KEY = "acadvocab:v2";
const LOG_KEY   = "acadvocab:studylog";

const INTERVALS = [1, 3, 7, 14, 30, 90];

function localDateStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function nextInterval(prev, isCorrect) {
  if (!isCorrect) return 1;
  const cur = prev?.interval || 0;
  const idx = INTERVALS.indexOf(cur);
  return INTERVALS[Math.min(INTERVALS.length - 1, idx < 0 ? 0 : idx + 1)];
}

function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return localDateStr(d);
}

export default function App() {
  const [view, setView]       = useState("home");
  const [cat, setCat]         = useState("all");
  const [progress, setProgress] = useState({});
  const [studyLog, setStudyLog] = useState({});
  const [loaded, setLoaded]   = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORE_KEY);
      if (v) {
        const raw = JSON.parse(v);
        const migrated = {};
        for (const [k, val] of Object.entries(raw)) {
          migrated[k] = typeof val === "string"
            ? { status: val, correct: 0, incorrect: 0, lastSeen: null }
            : val;
        }
        setProgress(migrated);
      }
    } catch (e) {}
    try {
      const log = localStorage.getItem(LOG_KEY);
      if (log) setStudyLog(JSON.parse(log));
    } catch (e) {}
    setLoaded(true);
  }, []);

  const saveProgress = useCallback((next) => {
    setProgress(next);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch (e) {}
  }, []);

  const saveLog = useCallback((next) => {
    setStudyLog(next);
    try { localStorage.setItem(LOG_KEY, JSON.stringify(next)); } catch (e) {}
  }, []);

  const mark = useCallback((en, status) => {
    const prev = progress[en] || {};
    const isCorrect = status === "known";
    const interval = nextInterval(prev, isCorrect);
    saveProgress({
      ...progress,
      [en]: { ...prev, status: status ?? null, lastSeen: Date.now(), interval, nextReview: addDays(interval) }
    });
    const today = localDateStr();
    saveLog({ ...studyLog, [today]: (studyLog[today] || 0) + 1 });
  }, [progress, studyLog, saveProgress, saveLog]);

  const markQuiz = useCallback((en, isCorrect) => {
    const prev = progress[en] || {};
    const interval = nextInterval(prev, isCorrect);
    saveProgress({
      ...progress,
      [en]: {
        ...prev,
        status: isCorrect ? "known" : "learning",
        correct:   (prev.correct   || 0) + (isCorrect ? 1 : 0),
        incorrect: (prev.incorrect || 0) + (isCorrect ? 0 : 1),
        lastSeen: Date.now(),
        interval,
        nextReview: addDays(interval),
      },
    });
    const today = localDateStr();
    saveLog({ ...studyLog, [today]: (studyLog[today] || 0) + 1 });
  }, [progress, studyLog, saveProgress, saveLog]);

  const deck = useMemo(
    () => (cat === "all" ? DATA : DATA.filter((d) => d.c === cat)),
    [cat]
  );

  const stats = useMemo(() => {
    let known = 0, learning = 0, correct = 0, answered = 0, due = 0;
    const today = localDateStr();
    for (const d of DATA) {
      const p = progress[d.e];
      if (p?.status === "known") known++;
      else if (p?.status === "learning") learning++;
      correct  += p?.correct   || 0;
      answered += (p?.correct || 0) + (p?.incorrect || 0);
      if (p?.nextReview && p.nextReview <= today) due++;
    }
    const accuracy = answered > 0 ? Math.round(correct / answered * 100) : null;
    return { total: DATA.length, known, learning, unseen: DATA.length - known - learning, accuracy, answered, due };
  }, [progress]);

  return (
    <div className="app">
      <Style />
      <header className="topbar">
        <div className="brand" onClick={() => setView("home")}>
          <span className="flask">⚛</span>
          <span className="brand-name">Lexicon<span className="dot">.</span>Lab</span>
        </div>
        <nav className="nav">
          <button className={view === "home"   ? "on" : ""} onClick={() => setView("home")}>ホーム</button>
          <button className={view === "flash"  ? "on" : ""} onClick={() => setView("flash")}>カード</button>
          <button className={view === "quiz"   ? "on" : ""} onClick={() => setView("quiz")}>クイズ</button>
          <button className={view === "browse" ? "on" : ""} onClick={() => setView("browse")}>一覧</button>
        </nav>
      </header>

      <main className="main">
        {!loaded && <div className="loading">読み込み中…</div>}
        {loaded && view === "home"   && <Home stats={stats} cat={cat} setCat={setCat} go={setView} studyLog={studyLog} />}
        {loaded && view === "flash"  && <Flash deck={deck} cat={cat} setCat={setCat} progress={progress} mark={mark} />}
        {loaded && view === "quiz"   && <Quiz deck={deck} cat={cat} setCat={setCat} markQuiz={markQuiz} progress={progress} />}
        {loaded && view === "browse" && <Browse cat={cat} setCat={setCat} progress={progress} mark={mark} />}
      </main>
    </div>
  );
}
