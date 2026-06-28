import React, { useState, useMemo } from "react";
import { CATS, DATA } from "../data/words";
import CatPicker from "./CatPicker";

const FILTERS = [
  ["all", "すべて"],
  ["unseen", "未学習"],
  ["learning", "要復習"],
  ["known", "習得済み"],
];

export default function Browse({ cat, setCat, progress, mark }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const base = useMemo(() => {
    const src = cat === "all" ? DATA : DATA.filter((d) => d.c === cat);
    const t = q.trim().toLowerCase();
    return !t ? src : src.filter((d) =>
      d.e.toLowerCase().includes(t) || d.j.includes(q.trim())
    );
  }, [cat, q]);

  const list = useMemo(() => {
    if (filter === "all") return base;
    return base.filter((d) => {
      const s = progress[d.e]?.status;
      if (filter === "unseen") return !s;
      return s === filter;
    });
  }, [base, filter, progress]);

  const counts = useMemo(() => ({
    all: base.length,
    unseen: base.filter(d => !progress[d.e]?.status).length,
    learning: base.filter(d => progress[d.e]?.status === "learning").length,
    known: base.filter(d => progress[d.e]?.status === "known").length,
  }), [base, progress]);

  const sel = selected ? DATA.find(d => d.e === selected) : null;

  return (
    <div className="browse">
      <div className="study-top">
        <CatPicker cat={cat} setCat={setCat} />
      </div>
      <input
        className="search"
        placeholder="英語・日本語で検索…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="status-tabs">
        {FILTERS.map(([k, l]) => (
          <button key={k} className={filter === k ? "stab stab-on" : "stab"} onClick={() => setFilter(k)}>
            {l}<span className="stab-ct">{counts[k]}</span>
          </button>
        ))}
      </div>
      <div className="list">
        {list.length === 0 && <p className="empty-line">該当する語がありません。</p>}
        {list.map((d) => {
          const meta = CATS[d.c];
          const status = progress[d.e]?.status;
          return (
            <div
              key={d.e}
              className={"row row-click" + (status ? " row-" + status : "")}
              onClick={() => setSelected(d.e)}
            >
              <span className="row-spine" style={{ background: meta.color }} />
              <div className="row-main">
                <div className="row-head">
                  <span className="row-en">{d.e}</span>
                  <span className="row-cat" style={{ color: meta.color }}>{meta.label}</span>
                </div>
                <div className="row-ja">{d.j}</div>
              </div>
              {status && (
                <div className="row-badge-wrap">
                  <span className={"badge " + status}>{status === "known" ? "習得" : "復習中"}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sel && (
        <WordModal word={sel} progress={progress} mark={mark} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function WordModal({ word, progress, mark, onClose }) {
  const p = progress[word.e] || {};
  const status = p.status;
  const correct = p.correct || 0;
  const incorrect = p.incorrect || 0;
  const total = correct + incorrect;
  const acc = total > 0 ? Math.round(correct / total * 100) : null;
  const meta = CATS[word.c];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span className="card-tab" style={{ background: meta.color, position: "static", display: "inline-block" }}>{meta.label}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-word">{word.e}</div>
        <div className="modal-ja">{word.j}</div>
        {word.x && (
          <div className="modal-ex-block">
            <p className="modal-ex-en">{word.x}</p>
            {word.xj && <p className="modal-ex-ja">{word.xj}</p>}
          </div>
        )}
        {total > 0 && (
          <div className="modal-stats">
            <span className="ms-ok">正解 {correct}</span>
            <span className="ms-sep">/</span>
            <span className="ms-ng">不正解 {incorrect}</span>
            {acc !== null && <span className="ms-acc">　正答率 {acc}%</span>}
          </div>
        )}
        <div className="modal-actions">
          <button
            className={status === "learning" ? "tagbtn learn on" : "tagbtn learn"}
            onClick={() => mark(word.e, status === "learning" ? null : "learning")}
          >要復習</button>
          <button
            className={status === "known" ? "tagbtn know on" : "tagbtn know"}
            onClick={() => mark(word.e, status === "known" ? null : "known")}
          >覚えた</button>
        </div>
      </div>
    </div>
  );
}
