import React from "react";
import { CATS, DATA } from "../data/words";
import CatPicker from "./CatPicker";

export default function Home({ stats, cat, setCat, go }) {
  const pct = Math.round((stats.known / stats.total) * 100);
  return (
    <div className="home">
      <section className="hero">
        <p className="eyebrow">論文を読むための学術英語</p>
        <h1 className="title">論文で<span className="accent">何度も出会う語</span>を<br />品詞ごとに身につける</h1>
        <p className="lede">
          有機化学の論文から抜き出した、専門用語ではなく「読むのに効く」英単語・表現を
          {stats.total}語収録。動詞・形容詞・副詞・名詞・つなぎ語などの品詞で整理してあります。
          カードでなじませ、クイズで定着させましょう。
        </p>

        <div className="coord">
          <div className="coord-track">
            <div className="coord-fill" style={{ width: pct + "%" }} />
            <div className="coord-knob" style={{ left: pct + "%" }} />
          </div>
          <div className="coord-labels">
            <span>習得 {stats.known}</span>
            <span className="mid">復習中 {stats.learning}</span>
            <span>未学習 {stats.unseen}</span>
          </div>
          {stats.accuracy !== null && (
            <div className="quiz-stat">
              クイズ正答率 <strong>{stats.accuracy}%</strong>
              <span className="quiz-stat-sub">（{stats.answered}問回答済み）</span>
            </div>
          )}
        </div>

        <div className="cta-row">
          <button className="cta cta-primary" onClick={() => go("flash")}>カードで学ぶ →</button>
          <button className="cta" onClick={() => go("quiz")}>クイズに挑戦</button>
          <button className="cta" onClick={() => go("browse")}>一覧で確認</button>
        </div>
      </section>

      <section className="picker-block">
        <h2 className="h2">品詞で絞り込む</h2>
        <p className="sub">選んだ品詞がカード・クイズ・一覧に反映されます。</p>
        <CatPicker cat={cat} setCat={setCat} />
        <div className="cat-grid">
          {Object.entries(CATS).map(([k, v]) => {
            const n = DATA.filter((d) => d.c === k).length;
            return (
              <div key={k} className="cat-card" onClick={() => { setCat(k); go("flash"); }}>
                <span className="cat-spine" style={{ background: v.color }} />
                <div className="cat-body">
                  <div className="cat-label">{v.label}</div>
                  <div className="cat-count">{n} 語</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
