import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DATA } from "./data/words";
import Style from "./components/Style";
import Home from "./components/Home";
import Flash from "./components/Flash";
import Quiz from "./components/Quiz";
import Browse from "./components/Browse";

const STORE_KEY = "acadvocab:v2";

export default function App() {
  const [view, setView] = useState("home");
  const [cat, setCat] = useState("all");
  const [progress, setProgress] = useState({});
  const [loaded, setLoaded] = useState(false);

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
    setLoaded(true);
  }, []);

  const saveProgress = useCallback((next) => {
    setProgress(next);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); }
    catch (e) {}
  }, []);

  const mark = useCallback((en, status) => {
    const prev = progress[en] || {};
    saveProgress({ ...progress, [en]: { ...prev, status: status ?? null, lastSeen: Date.now() } });
  }, [progress, saveProgress]);

  const markQuiz = useCallback((en, isCorrect) => {
    const prev = progress[en] || {};
    saveProgress({
      ...progress,
      [en]: {
        ...prev,
        status: isCorrect ? "known" : "learning",
        correct: (prev.correct || 0) + (isCorrect ? 1 : 0),
        incorrect: (prev.incorrect || 0) + (isCorrect ? 0 : 1),
        lastSeen: Date.now(),
      },
    });
  }, [progress, saveProgress]);

  const deck = useMemo(
    () => (cat === "all" ? DATA : DATA.filter((d) => d.c === cat)),
    [cat]
  );

  const stats = useMemo(() => {
    let known = 0, learning = 0, correct = 0, answered = 0;
    for (const d of DATA) {
      const p = progress[d.e];
      if (p?.status === "known") known++;
      else if (p?.status === "learning") learning++;
      correct += p?.correct || 0;
      answered += (p?.correct || 0) + (p?.incorrect || 0);
    }
    const accuracy = answered > 0 ? Math.round(correct / answered * 100) : null;
    return { total: DATA.length, known, learning, unseen: DATA.length - known - learning, accuracy, answered };
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
          <button className={view === "home" ? "on" : ""} onClick={() => setView("home")}>ホーム</button>
          <button className={view === "flash" ? "on" : ""} onClick={() => setView("flash")}>カード</button>
          <button className={view === "quiz" ? "on" : ""} onClick={() => setView("quiz")}>クイズ</button>
          <button className={view === "browse" ? "on" : ""} onClick={() => setView("browse")}>一覧</button>
        </nav>
      </header>

      <main className="main">
        {!loaded && <div className="loading">読み込み中…</div>}
        {loaded && view === "home" && (
          <Home stats={stats} cat={cat} setCat={setCat} go={setView} />
        )}
        {loaded && view === "flash" && (
          <Flash deck={deck} cat={cat} setCat={setCat} progress={progress} mark={mark} />
        )}
        {loaded && view === "quiz" && (
          <Quiz deck={deck} cat={cat} setCat={setCat} markQuiz={markQuiz} />
        )}
        {loaded && view === "browse" && (
          <Browse cat={cat} setCat={setCat} progress={progress} mark={mark} />
        )}
      </main>
    </div>
  );
}
