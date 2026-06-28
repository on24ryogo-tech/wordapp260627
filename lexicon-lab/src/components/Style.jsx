import React from "react";

export default function Style() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
:root{
  --bg:#EAEEF2; --surface:#FFFFFF; --ink:#15212B; --muted:#5B6B78;
  --line:#D5DCE3; --cobalt:#2552D9; --cobalt-soft:#EAF0FF;
  --green:#15803D; --amber:#B45309; --rose:#BE185D;
}
.app{
  min-height:100vh; background:var(--bg); color:var(--ink);
  font-family:'Inter',system-ui,sans-serif; line-height:1.55;
  background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);
  background-size:28px 28px; background-position:-1px -1px;
}
.app::before{ content:""; position:fixed; inset:0; background:rgba(234,238,242,0.55); pointer-events:none; z-index:0; }
.topbar,.main{ position:relative; z-index:1; }

.topbar{ display:flex; align-items:center; justify-content:space-between; padding:14px 20px; background:rgba(255,255,255,0.85); backdrop-filter:blur(8px); border-bottom:1px solid var(--line); position:sticky; top:0; z-index:5; }
.brand{ display:flex; align-items:center; gap:9px; cursor:pointer; }
.flask{ font-size:22px; color:var(--cobalt); }
.brand-name{ font-family:'Fraunces',serif; font-weight:700; font-size:19px; letter-spacing:-.01em; }
.dot{ color:var(--cobalt); }
.nav{ display:flex; gap:4px; flex-wrap:wrap; }
.nav button{ font-family:'Inter'; font-size:13.5px; font-weight:600; color:var(--muted); background:transparent; border:none; padding:7px 12px; border-radius:8px; cursor:pointer; }
.nav button:hover{ background:var(--cobalt-soft); color:var(--cobalt); }
.nav button.on{ background:var(--cobalt); color:#fff; }

.main{ max-width:880px; margin:0 auto; padding:26px 20px 80px; }
.loading,.empty-line{ color:var(--muted); padding:40px 8px; text-align:center; font-size:15px; }

.eyebrow{ font-family:'JetBrains Mono',monospace; font-size:11.5px; letter-spacing:.18em; text-transform:uppercase; color:var(--cobalt); margin-bottom:14px; }
.title{ font-family:'Fraunces',serif; font-weight:700; font-size:clamp(30px,6vw,46px); line-height:1.08; letter-spacing:-.02em; margin-bottom:16px; }
.title .accent{ color:var(--cobalt); position:relative; }
.title .accent::after{ content:""; position:absolute; left:0; right:0; bottom:4px; height:9px; background:rgba(37,82,217,.16); z-index:-1; }
.lede{ color:var(--muted); font-size:15.5px; max-width:62ch; margin-bottom:26px; }

.coord{ margin:6px 0 26px; }
.coord-track{ position:relative; height:6px; background:var(--line); border-radius:99px; }
.coord-fill{ position:absolute; left:0; top:0; bottom:0; background:linear-gradient(90deg,#4F79EE,var(--cobalt)); border-radius:99px; transition:width .5s ease; }
.coord-knob{ position:absolute; top:50%; width:14px; height:14px; background:#fff; border:3px solid var(--cobalt); border-radius:50%; transform:translate(-50%,-50%); transition:left .5s ease; }
.coord-labels{ display:flex; justify-content:space-between; margin-top:12px; font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted); }
.coord-labels .mid{ color:var(--amber); }

.cta-row{ display:flex; gap:10px; flex-wrap:wrap; }
.cta{ font-family:'Inter'; font-weight:600; font-size:14.5px; padding:11px 18px; border-radius:10px; border:1px solid var(--line); background:var(--surface); color:var(--ink); cursor:pointer; }
.cta:hover{ border-color:var(--cobalt); color:var(--cobalt); }
.cta-primary{ background:var(--cobalt); color:#fff; border-color:var(--cobalt); }
.cta-primary:hover{ background:#1c45bd; color:#fff; }

.picker-block{ margin-top:46px; border-top:1px solid var(--line); padding-top:30px; }
.h2{ font-family:'Fraunces',serif; font-weight:600; font-size:22px; }
.sub{ color:var(--muted); font-size:13.5px; margin:4px 0 16px; }
.chips{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; }
.chip{ font-family:'Inter'; font-size:12.5px; font-weight:600; padding:6px 12px; border-radius:99px; background:var(--surface); border:1px solid var(--line); color:var(--muted); cursor:pointer; }
.chip-on{ background:var(--ink); color:#fff; border-color:var(--ink); }

.cat-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:12px; }
.cat-card{ display:flex; background:var(--surface); border:1px solid var(--line); border-radius:12px; overflow:hidden; cursor:pointer; transition:transform .12s ease, box-shadow .12s ease; }
.cat-card:hover{ transform:translateY(-2px); box-shadow:0 8px 22px rgba(21,33,43,.08); }
.cat-spine{ width:7px; flex:none; }
.cat-body{ padding:14px 16px; }
.cat-label{ font-weight:600; font-size:15px; }
.cat-count{ font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted); margin-top:3px; }

.study,.browse{ display:flex; flex-direction:column; }
.study-top{ margin-bottom:18px; }
.study-meta{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
.counter{ font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--muted); }
.ghost{ background:transparent; border:1px solid var(--line); border-radius:8px; padding:6px 12px; font-family:'Inter'; font-size:13px; font-weight:600; color:var(--muted); cursor:pointer; }
.ghost:hover{ border-color:var(--cobalt); color:var(--cobalt); }

.card{ perspective:1400px; cursor:pointer; margin:6px 0 22px; }
.card-inner{ position:relative; width:100%; min-height:280px; transform-style:preserve-3d; transition:transform .5s cubic-bezier(.2,.7,.2,1); }
.card.flipped .card-inner{ transform:rotateY(180deg); }
.card-face{ position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; background:var(--surface); border:1px solid var(--line); border-radius:16px; box-shadow:0 10px 30px rgba(21,33,43,.07); padding:30px 28px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; }
.card-back{ transform:rotateY(180deg); }
.card-tab{ position:absolute; top:16px; left:16px; color:#fff; font-size:11.5px; font-weight:600; padding:4px 10px; border-radius:7px; }
.badge{ position:absolute; top:16px; right:16px; font-size:11px; font-weight:700; padding:4px 9px; border-radius:7px; }
.badge.known{ background:rgba(21,128,61,.12); color:var(--green); }
.badge.learning{ background:rgba(180,83,9,.12); color:var(--amber); }
.word{ font-family:'Fraunces',serif; font-weight:600; font-size:clamp(26px,5.5vw,40px); letter-spacing:-.01em; padding:0 6px; }
.tap-hint{ position:absolute; bottom:18px; font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--muted); }
.meaning{ font-size:clamp(20px,4.4vw,28px); font-weight:700; margin-bottom:14px; }
.example{ max-width:52ch; }
.ex-en{ font-style:italic; color:var(--ink); font-size:15px; }
.word-small{ position:absolute; bottom:18px; font-family:'JetBrains Mono',monospace; font-size:12.5px; color:var(--muted); }

.study-controls{ display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
.ctrl{ font-family:'Inter'; font-weight:600; font-size:13.5px; padding:12px 6px; border-radius:10px; border:1px solid var(--line); background:var(--surface); color:var(--ink); cursor:pointer; }
.ctrl:hover{ border-color:var(--cobalt); }
.ctrl.know{ background:var(--green); color:#fff; border-color:var(--green); }
.ctrl.learn{ background:var(--amber); color:#fff; border-color:var(--amber); }

.quiz{ background:var(--surface); border:1px solid var(--line); border-radius:16px; box-shadow:0 10px 30px rgba(21,33,43,.06); padding:26px 22px; }
.quiz-prompt{ position:relative; padding-top:8px; margin-bottom:22px; text-align:center; }
.quiz-prompt .card-tab{ position:static; display:inline-block; margin-bottom:14px; }
.quiz-label{ color:var(--muted); font-size:13px; margin-bottom:8px; }
.quiz-q{ font-family:'Fraunces',serif; font-weight:600; font-size:clamp(22px,4.6vw,32px); letter-spacing:-.01em; }
.quiz-options{ display:grid; gap:10px; }
.opt{ font-family:'Inter'; font-size:15px; font-weight:500; text-align:left; padding:14px 16px; border-radius:11px; border:1px solid var(--line); background:#fff; color:var(--ink); cursor:pointer; transition:border-color .12s, background .12s; }
.opt:hover{ border-color:var(--cobalt); background:var(--cobalt-soft); }
.opt.correct{ border-color:var(--green); background:rgba(21,128,61,.10); color:var(--green); font-weight:700; }
.opt.wrong{ border-color:var(--rose); background:rgba(190,24,93,.08); color:var(--rose); }
.opt.dim{ opacity:.5; }
.quiz-foot{ margin-top:18px; text-align:center; }
.quiz-ex{ font-style:italic; color:var(--muted); font-size:14px; margin-bottom:14px; }

.search{ width:100%; font-family:'Inter'; font-size:15px; padding:12px 15px; border-radius:11px; border:1px solid var(--line); background:var(--surface); color:var(--ink); margin-bottom:16px; outline:none; }
.search:focus{ border-color:var(--cobalt); }
.list{ display:flex; flex-direction:column; gap:10px; }
.row{ display:flex; background:var(--surface); border:1px solid var(--line); border-radius:12px; overflow:hidden; }
.row-spine{ width:6px; flex:none; }
.row-main{ flex:1; padding:13px 15px; min-width:0; }
.row-head{ display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; }
.row-en{ font-family:'Fraunces',serif; font-weight:600; font-size:17px; }
.row-cat{ font-size:11.5px; font-weight:600; }
.row-ja{ font-size:14.5px; margin-top:2px; }
.row-ex{ font-style:italic; color:var(--muted); font-size:13px; margin-top:5px; }
.row-actions{ display:flex; flex-direction:column; gap:6px; padding:13px 13px 13px 0; flex:none; }
.tagbtn{ font-family:'Inter'; font-size:11.5px; font-weight:600; padding:6px 10px; border-radius:8px; border:1px solid var(--line); background:#fff; color:var(--muted); cursor:pointer; white-space:nowrap; }
.tagbtn.know.on{ background:var(--green); color:#fff; border-color:var(--green); }
.tagbtn.learn.on{ background:var(--amber); color:#fff; border-color:var(--amber); }

@media (max-width:560px){
  .study-controls{ grid-template-columns:repeat(2,1fr); }
  .row-actions{ flex-direction:column; }
}
@media (prefers-reduced-motion:reduce){
  .card-inner{ transition:none; }
  .cat-card{ transition:none; }
  .coord-fill,.coord-knob{ transition:none; }
}
    `}</style>
  );
}
