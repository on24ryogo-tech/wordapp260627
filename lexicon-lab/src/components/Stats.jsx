import React, { useMemo } from "react";
import { CATS, DATA } from "../data/words";
import Calendar from "./Calendar";

function localDateStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

const WEEKDAYS = ["日","月","火","水","木","金","土"];

export default function Stats({ progress, studyLog, stats, go }) {
  // 品詞別の習得状況
  const byCat = useMemo(() => {
    return Object.entries(CATS).map(([k, v]) => {
      const words = DATA.filter(d => d.c === k);
      let known = 0, learning = 0;
      for (const w of words) {
        const s = progress[w.e]?.status;
        if (s === "known") known++;
        else if (s === "learning") learning++;
      }
      return { key: k, label: v.label, color: v.color, total: words.length, known, learning };
    });
  }, [progress]);

  // 直近7日間の学習語数
  const week = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = localDateStr(d);
      return { day: WEEKDAYS[d.getDay()], count: studyLog[key] || 0, isToday: i === 6 };
    });
  }, [studyLog]);
  const weekMax = Math.max(1, ...week.map(w => w.count));
  const weekTotal = week.reduce((a, w) => a + w.count, 0);

  // 苦手語トップ5（誤答が多く正答率が低い語）
  const weakest = useMemo(() => {
    return DATA
      .map(d => {
        const p = progress[d.e];
        const c = p?.correct || 0, ic = p?.incorrect || 0;
        return { ...d, c, ic, total: c + ic };
      })
      .filter(d => d.ic >= 1)
      .sort((a, b) => (b.ic - b.c) - (a.ic - a.c) || b.ic - a.ic)
      .slice(0, 5);
  }, [progress]);

  const pct = Math.round((stats.known / stats.total) * 100);

  return (
    <div className="stats-page">
      <h2 className="h2">学習統計</h2>

      {/* サマリータイル */}
      <div className="stat-tiles">
        <div className="stat-tile">
          <div className="stat-num">{pct}<span className="stat-unit">%</span></div>
          <div className="stat-label">習得率</div>
        </div>
        <div className="stat-tile">
          <div className="stat-num">{stats.known}<span className="stat-unit">語</span></div>
          <div className="stat-label">習得済み</div>
        </div>
        <div className="stat-tile">
          <div className="stat-num">{stats.due}<span className="stat-unit">語</span></div>
          <div className="stat-label">復習期限</div>
        </div>
        <div className="stat-tile">
          <div className="stat-num">{stats.accuracy !== null ? stats.accuracy : "–"}<span className="stat-unit">%</span></div>
          <div className="stat-label">クイズ正答率</div>
        </div>
      </div>

      <Calendar studyLog={studyLog} />

      {/* 週間チャート */}
      <section className="stat-section">
        <h3 className="stat-h3">この7日間 <span className="stat-sub">計 {weekTotal} 語</span></h3>
        <div className="week-chart">
          {week.map((w, i) => (
            <div key={i} className="week-col">
              <div className="week-bar-wrap">
                <div className={"week-bar" + (w.isToday ? " week-today" : "")}
                  style={{ height: Math.max(4, Math.round(w.count / weekMax * 100)) + "%" }} />
              </div>
              <div className="week-count">{w.count || ""}</div>
              <div className={"week-day" + (w.isToday ? " week-day-today" : "")}>{w.day}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 品詞別 */}
      <section className="stat-section">
        <h3 className="stat-h3">品詞別の進捗</h3>
        <div className="cat-progress">
          {byCat.map(c => {
            const kp = Math.round(c.known / c.total * 100);
            const lp = Math.round(c.learning / c.total * 100);
            return (
              <div key={c.key} className="catp-row">
                <div className="catp-head">
                  <span className="catp-label"><span className="catp-dot" style={{ background: c.color }} />{c.label}</span>
                  <span className="catp-nums">{c.known} / {c.total}</span>
                </div>
                <div className="catp-track">
                  <div className="catp-known" style={{ width: kp + "%", background: c.color }} />
                  <div className="catp-learning" style={{ width: lp + "%" }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 苦手語 */}
      {weakest.length > 0 && (
        <section className="stat-section">
          <h3 className="stat-h3">苦手な語 <span className="stat-sub">誤答が多い順</span></h3>
          <div className="weak-list">
            {weakest.map(w => (
              <div key={w.e} className="weak-row" onClick={() => go("flash")}>
                <span className="weak-word">{w.e}</span>
                <span className="weak-ja">{w.j}</span>
                <span className="weak-score">✕{w.ic} ○{w.c}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
