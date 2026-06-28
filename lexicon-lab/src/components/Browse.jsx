import React, { useState, useMemo } from "react";
import { CATS, DATA } from "../data/words";
import CatPicker from "./CatPicker";

export default function Browse({ cat, setCat, progress, mark }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const base = cat === "all" ? DATA : DATA.filter((d) => d.c === cat);
    const t = q.trim().toLowerCase();
    if (!t) return base;
    return base.filter((d) => d.e.toLowerCase().includes(t) || d.j.includes(q.trim()));
  }, [cat, q]);

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
      <div className="list">
        {list.length === 0 && <p className="empty-line">該当する語がありません。</p>}
        {list.map((d) => {
          const meta = CATS[d.c];
          const status = progress[d.e];
          return (
            <div key={d.e} className="row">
              <span className="row-spine" style={{ background: meta.color }} />
              <div className="row-main">
                <div className="row-head">
                  <span className="row-en">{d.e}</span>
                  <span className="row-cat" style={{ color: meta.color }}>{meta.label}</span>
                </div>
                <div className="row-ja">{d.j}</div>
                {d.x && <div className="row-ex">{d.x}</div>}
              </div>
              <div className="row-actions">
                <button
                  className={status === "learning" ? "tagbtn learn on" : "tagbtn learn"}
                  onClick={() => mark(d.e, status === "learning" ? null : "learning")}
                  title="要復習"
                >要復習</button>
                <button
                  className={status === "known" ? "tagbtn know on" : "tagbtn know"}
                  onClick={() => mark(d.e, status === "known" ? null : "known")}
                  title="覚えた"
                >覚えた</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
