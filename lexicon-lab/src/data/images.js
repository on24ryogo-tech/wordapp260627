// ── 論文からの局所画像 (優先) ────────────────────────────────────
// Roh, Williams & Cornella, Nature 654, 92–99 (2026) / CC BY 4.0
const PC = "Roh, Williams & Cornella, Nature 654, 92 (2026) / CC BY 4.0";
export const LOCAL_FIGURES = {
  "nucleophile":           { src: "/figures/fig_nucleophile_electrophile.png", credit: PC },
  "electrophile":          { src: "/figures/fig_nucleophile_electrophile.png", credit: PC },
  "cross-coupling":        { src: "/figures/fig_cross_coupling.png",           credit: PC },
  "catalytic cycle":       { src: "/figures/fig_catalytic_cycle.png",          credit: PC },
  "oxidative addition":    { src: "/figures/fig_oxidative_addition.png",       credit: PC },
  "transmetalation":       { src: "/figures/fig_oxidative_addition.png",       credit: PC },
  "reductive elimination": { src: "/figures/fig_catalytic_cycle.png",          credit: PC },
  "intermediate":          { src: "/figures/fig_mechanism.png",                credit: PC },
  "scaffold":              { src: "/figures/fig_scope.png",                    credit: PC },
};

// ── Wikipedia フォールバック ──────────────────────────────────────
// action API (?prop=pageimages) で取得。LOCAL_FIGURESにある単語は使われない
export const WIKI_ARTICLES = {
  // ── エネルギー図 ─────────────────────────────────────────────
  "transition state":       "Transition state",
  "activation barrier":     "Activation energy",
  "rate-determining step":  "Rate-determining step",
  "enthalpy":               "Enthalpy",
  "entropy":                "Entropy",
  "Eyring analysis":        "Eyring equation",
  "kinetic profile":        "Chemical kinetics",
  "rate constant":          "Reaction rate constant",

  // ── 有機反応機構 ──────────────────────────────────────────────
  "homolysis":              "Homolysis (chemistry)",
  "abstraction":            "Radical (chemistry)",
  "hydrogen atom transfer": "Hydrogen atom transfer",
  "deprotonation":          "Deprotonation",
  "cleavage":               "Bond cleavage",
  "β-hydride elimination":  "Beta-hydride elimination",
  "migratory insertion":    "Migratory insertion",

  // ── 有機金属・触媒 ────────────────────────────────────────────
  "coordination":           "Coordination complex",
  "ligand":                 "Ligand",
  "turnover":               "Turnover number",

  // ── 速度論・理論 ──────────────────────────────────────────────
  "kinetic isotope effect": "Kinetic isotope effect",
  "Hammett plot":           "Hammett equation",
  "DFT calculations":       "Density functional theory",
  "electrostatic potential":"Electrostatic potential",

  // ── 立体化学 ──────────────────────────────────────────────────
  "oxidation state":        "Oxidation state",
  "racemization":           "Racemization",
  "regioselectivity":       "Regioselectivity",
  "stereoretention":        "Walden inversion",
  "radical clock":          "Radical clock",

  // ── その他の名詞 ──────────────────────────────────────────────
  "substituent":            "Substituent",
  "moiety":                 "Functional group",
  "building block":         "Building block (chemistry)",
  "atom economy":           "Atom economy",
  "by-product":             "By-product",
  "spin state":             "Spin (physics)",
};
