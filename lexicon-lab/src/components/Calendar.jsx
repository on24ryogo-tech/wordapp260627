import React from "react";

function localDateStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function levelClass(count) {
  if (!count) return "l0";
  if (count <= 2)  return "l1";
  if (count <= 5)  return "l2";
  if (count <= 10) return "l3";
  return "l4";
}

function computeStreak(studyLog) {
  const d = new Date();
  if (!(studyLog[localDateStr(d)] > 0)) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (studyLog[localDateStr(d)] > 0) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

const MONTH_NAMES = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

export default function Calendar({ studyLog }) {
  const WEEKS = 16;
  const TOTAL = WEEKS * 7;

  // Build dates: index 0 = oldest day, index TOTAL-1 = today
  const dates = Array.from({ length: TOTAL }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (TOTAL - 1 - i));
    return localDateStr(d);
  });

  // Month labels per column (show when month changes)
  const monthLabels = Array.from({ length: WEEKS }, (_, wi) => {
    const date = dates[wi * 7];
    const prev = wi > 0 ? dates[(wi - 1) * 7] : null;
    if (!prev || prev.slice(5, 7) !== date.slice(5, 7)) {
      return MONTH_NAMES[parseInt(date.slice(5, 7)) - 1];
    }
    return "";
  });

  const today = localDateStr();
  const todayCount = studyLog[today] || 0;
  const streak = computeStreak(studyLog);

  return (
    <div className="cal-section">
      <div className="cal-header">
        <span className="cal-title">学習カレンダー</span>
        <div className="cal-chips">
          <span className="cal-chip">🔥 {streak}日連続</span>
          <span className="cal-chip">今日 {todayCount}語</span>
        </div>
      </div>
      <div className="cal-scroll">
        <div className="cal-month-row">
          {monthLabels.map((label, wi) => (
            <div key={wi} className="cal-month-cell">{label}</div>
          ))}
        </div>
        <div className="cal-grid">
          {Array.from({ length: WEEKS }, (_, wi) => (
            <div key={wi} className="cal-col">
              {Array.from({ length: 7 }, (_, di) => {
                const date = dates[wi * 7 + di];
                const count = studyLog[date] || 0;
                const isToday = date === today;
                return (
                  <div
                    key={di}
                    className={"cal-cell " + levelClass(count) + (isToday ? " cal-today" : "")}
                    title={`${date}  ${count ? count + "語学習" : "未学習"}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="cal-legend">
          <span className="cal-leg-label">少</span>
          {["l0","l1","l2","l3","l4"].map(c => <div key={c} className={"cal-cell " + c} />)}
          <span className="cal-leg-label">多</span>
        </div>
      </div>
    </div>
  );
}
