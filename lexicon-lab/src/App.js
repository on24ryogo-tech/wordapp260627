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
      if (v) setProgress(JSON.parse(v));
    } catch (e) {}
    setLoaded(true);
  }, []);

  const saveProgress = useCallback((next) => {
    setProgress(next);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); }
    catch (e) {}
  }, []);

  const mark = useCallback((en, status) => {
    saveProgress({ ...progress, [en]: status });
  }, [progress, saveProgress]);

  const deck = useMemo(
    () => (cat === "all" ? DATA : DATA.filter((d) => d.c === cat)),
    [cat]
  );

  const stats = useMemo(() => {
    let known = 0, learning = 0;
    for (const d of DATA) {
      if (progress[d.e] === "known") known++;
      else if (progress[d.e] === "learning") learning++;
    }
    return { total: DATA.length, known, learning, unseen: DATA.length - known - learning };
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
          <Quiz deck={deck} cat={cat} setCat={setCat} mark={mark} />
        )}
        {loaded && view === "browse" && (
          <Browse cat={cat} setCat={setCat} progress={progress} mark={mark} />
        )}
      </main>
    </div>
  );
}
