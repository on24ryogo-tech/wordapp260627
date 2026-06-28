import React from "react";
import { CATS } from "../data/words";

export default function CatPicker({ cat, setCat }) {
  return (
    <div className="chips">
      <button className={cat === "all" ? "chip chip-on" : "chip"} onClick={() => setCat("all")}>
        すべて
      </button>
      {Object.entries(CATS).map(([k, v]) => (
        <button
          key={k}
          className={cat === k ? "chip chip-on" : "chip"}
          style={cat === k ? { background: v.color, borderColor: v.color, color: "#fff" } : { borderColor: v.color, color: v.color }}
          onClick={() => setCat(k)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
