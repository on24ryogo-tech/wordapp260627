import React from "react";
import CatPicker from "./CatPicker";

export default function Empty({ msg, cat, setCat }) {
  return (
    <div className="study">
      {cat !== undefined && <div className="study-top"><CatPicker cat={cat} setCat={setCat} /></div>}
      <p className="empty-line">{msg || "この条件のカードはありません。"}</p>
    </div>
  );
}
