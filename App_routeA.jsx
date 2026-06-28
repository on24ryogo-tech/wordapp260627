import React, { useState, useEffect, useMemo, useCallback } from "react";

/* ============================================================
   Academic English Vocabulary Trainer  —  品詞別バージョン
   論文を読むための学術英語を、動詞・形容詞・副詞などの品詞で学ぶ
   ============================================================ */

const CATS = {
  verb: { label: "動詞",          color: "#2552D9" },
  noun: { label: "名詞",          color: "#BE185D" },
  adj:  { label: "形容詞",        color: "#B45309" },
  adv:  { label: "副詞",          color: "#0E7490" },
  conn: { label: "接続・つなぎ",  color: "#475569" },
  phr:  { label: "句動詞・熟語",  color: "#0D9488" },
  expr: { label: "定型・発表表現", color: "#4338CA" },
};

const DATA = [
  // ── 動詞 ──────────────────────────────
  { e: "we report", j: "（〜を）報告する", x: "We report a series of bismuth complexes that undergo oxidative addition.", c: "verb" },
  { e: "disclose", j: "（成果を）公表する・明らかにする", x: "We disclose here data that supports a distinct mechanism.", c: "verb" },
  { e: "describe", j: "記述する・述べる", x: "Here, we describe a catalytic enantioselective allylation.", c: "verb" },
  { e: "present", j: "提示する・示す", x: "The design presented here enables a Bi complex to cycle.", c: "verb" },
  { e: "demonstrate", j: "実証する", x: "Its synthetic utility was demonstrated through scalable synthesis.", c: "verb" },
  { e: "document", j: "（データで）裏付ける・記録する", x: "These observations are well documented in the literature.", c: "verb" },
  { e: "highlight", j: "強調する・浮き彫りにする", x: "This work highlights the potential of photoelectrocatalysis.", c: "verb" },
  { e: "showcase", j: "示してみせる・披露する", x: "We showcase the utility of the alkenyl electrophiles.", c: "verb" },
  { e: "underscore", j: "強調する", x: "The results underscore its superior selectivity.", c: "verb" },
  { e: "establish", j: "確立する", x: "A detailed study established a catalytic cycle.", c: "verb" },
  { e: "reveal", j: "明らかにする", x: "X-ray analysis revealed a monomeric pentavalent complex.", c: "verb" },
  { e: "illustrate", j: "例示する・例で示す", x: "Substitution was tolerated, as illustrated by 36.", c: "verb" },
  { e: "hypothesize", j: "仮説を立てる", x: "We hypothesized that a radical-based mechanism might enable it.", c: "verb" },
  { e: "envision", j: "構想する・思い描く", x: "We envisioned a cobalt-catalyzed photoelectrochemical cycle.", c: "verb" },
  { e: "envisage", j: "想定する・見込む", x: "Such reactivity could be envisaged for related scenarios.", c: "verb" },
  { e: "anticipate", j: "予想する・見越す", x: "As anticipated, coordination of the pending group is weaker.", c: "verb" },
  { e: "presume", j: "推定する", x: "We presumed that elimination could be ascribed to the NCF3 group.", c: "verb" },
  { e: "postulate", j: "仮定する・前提とする", x: "Cationic pathways have also been postulated.", c: "verb" },
  { e: "propose", j: "提案する", x: "An E1cB mechanism is proposed.", c: "verb" },
  { e: "rationalize", j: "合理的に説明する", x: "To rationalize the selectivity, we examined the transition states.", c: "verb" },
  { e: "speculate", j: "推測する", x: "We speculate that the excess ligand prevents overreduction.", c: "verb" },
  { e: "surmise", j: "推測する・察する", x: "We surmise that an alternative pathway is operative.", c: "verb" },
  { e: "invoke", j: "（説明として）持ち出す", x: "No exotic intermediate need be invoked.", c: "verb" },
  { e: "implicate", j: "（関与を）示唆する", x: "The KIE implicates β-acetate elimination in the rate-limiting step.", c: "verb" },
  { e: "observe", j: "観測する・観察する", x: "A first-order kinetic profile was observed.", c: "verb" },
  { e: "afford", j: "（生成物を）与える", x: "The reaction afforded the alkene in 85% yield.", c: "verb" },
  { e: "furnish", j: "（生成物を）与える", x: "Mild base furnished the alkenyl sulfonium salt cleanly.", c: "verb" },
  { e: "deliver", j: "もたらす・与える", x: "The protocol delivered enantioenriched 1,4-dienes.", c: "verb" },
  { e: "yield", j: "（収率で）与える；収率", x: "Thermal decomposition yielded fluorobenzene in 94% yield.", c: "verb" },
  { e: "obtain", j: "得る", x: "A 95% yield of 5 was obtained.", c: "verb" },
  { e: "isolate", j: "単離する", x: "We were able to isolate the two diastereomeric intermediates.", c: "verb" },
  { e: "detect", j: "検出する", x: "No linear byproduct was detected.", c: "verb" },
  { e: "exhibit", j: "示す・呈する", x: "The reaction exhibited excellent functional-group tolerance.", c: "verb" },
  { e: "display", j: "示す", x: "This method displays broad substrate scope.", c: "verb" },
  { e: "undergo", j: "（反応・変化を）受ける", x: "Bi can undergo oxidative addition akin to transition metals.", c: "verb" },
  { e: "accompany", j: "伴う", x: "Elimination was accompanied by formation of fluorobismine.", c: "verb" },
  { e: "proceed", j: "進行する", x: "Cross-coupling proceeds with retention of geometry.", c: "verb" },
  { e: "tolerate", j: "（官能基を）許容する", x: "Sulfone and nitrile moieties are all tolerated.", c: "verb" },
  { e: "accommodate", j: "受け入れる・対応する", x: "Oxygenated substituents were well accommodated.", c: "verb" },
  { e: "access", j: "入手する・合成的に得る", x: "This provides modular access to chiral dienes.", c: "verb" },
  { e: "convert", j: "変換する", x: "A variety of ArBpin were smoothly converted to aryl fluorides.", c: "verb" },
  { e: "warrant", j: "（〜を）正当化する・必要とする", x: "Further mechanistic studies are warranted.", c: "verb" },
  { e: "characterize", j: "同定する・特性評価する", x: "The species were characterized by X-ray crystallography.", c: "verb" },
  { e: "communicate", j: "（速報として）報告する", c: "verb" },
  { e: "detail", j: "詳述する", x: "Below we detail the optimization of each step.", c: "verb" },
  { e: "summarize", j: "要約する", c: "verb" },
  { e: "conclude", j: "結論づける", x: "We conclude that a cationic intermediate is involved.", c: "verb" },
  { e: "claim", j: "主張する", c: "verb" },
  { e: "argue", j: "論じる・主張する", x: "We argue that steric effects govern the chemoselectivity.", c: "verb" },
  { e: "note", j: "言及する・指摘する", x: "It is worth noting that the catalyst is recyclable.", c: "verb" },
  { e: "emphasize", j: "強調する", c: "verb" },
  { e: "corroborate", j: "裏付ける・確証する", x: "These findings corroborate the observed preference.", c: "verb" },
  { e: "substantiate", j: "実証する・根拠づける", x: "To substantiate the viability of the dication, we used CV.", c: "verb" },
  { e: "validate", j: "妥当性を示す・検証する", x: "Robustness was validated in an ElectraSyn reactor.", c: "verb" },
  { e: "confirm", j: "確認する", x: "Control experiments confirmed that the cobalt catalyst is essential.", c: "verb" },
  { e: "verify", j: "検証する", c: "verb" },
  { e: "assume", j: "仮定する", c: "verb" },
  { e: "conceive", j: "着想する・構想する", c: "verb" },
  { e: "infer", j: "推論する", c: "verb" },
  { e: "deduce", j: "演繹する・導き出す", c: "verb" },
  { e: "predict", j: "予測する", x: "The polarity rule predicts that the fluorides occupy apical positions.", c: "verb" },
  { e: "suspect", j: "〜ではないかと考える", c: "verb" },
  { e: "contend", j: "主張する・論じる", c: "verb" },
  { e: "assert", j: "断言する", c: "verb" },
  { e: "conjecture", j: "推測（する）", c: "verb" },
  { e: "emerge", j: "現れる・台頭する", x: "MHAT has emerged as a powerful tool for alkene derivatization.", c: "verb" },
  { e: "arise", j: "生じる", x: "The selectivity may arise from an inverse-electron-demand cycloaddition.", c: "verb" },
  { e: "ensue", j: "続いて起こる", c: "verb" },
  { e: "generate", j: "生成する・発生させる", x: "β-scission generates an alkyl radical.", c: "verb" },
  { e: "liberate", j: "遊離させる・放出する", x: "Protonolysis liberates H2 and regenerates the catalyst.", c: "verb" },
  { e: "regenerate", j: "再生する", c: "verb" },
  { e: "consume", j: "消費する", x: "Only 1.5 equiv were consumed, allowing recovery of the excess.", c: "verb" },
  { e: "recover", j: "回収する", x: "Some starting material was recovered.", c: "verb" },
  { e: "dominate", j: "支配的である", x: "In the dark, hydrogenation dominates.", c: "verb" },
  { e: "persist", j: "持続する・残存する", c: "verb" },
  { e: "decompose", j: "分解する", c: "verb" },
  { e: "elucidate", j: "解明する・明らかにする", x: "Computational studies elucidate the origin of selectivity.", c: "verb" },
  { e: "delineate", j: "明確に描き出す・線引きする", c: "verb" },
  { e: "exemplify", j: "例示する・典型例である", c: "verb" },
  { e: "denote", j: "示す・意味する", c: "verb" },
  { e: "discern", j: "識別する・見分ける", x: "It is difficult to discern between the two mechanisms.", c: "verb" },
  { e: "scrutinize", j: "精査する・綿密に調べる", c: "verb" },
  { e: "assess", j: "評価する・見積もる", x: "We assessed the generality of the method.", c: "verb" },
  { e: "pinpoint", j: "正確に特定する", c: "verb" },
  { e: "correlate", j: "相関する・対応づける", x: "Reactivity correlates with the electron density.", c: "verb" },
  { e: "encompass", j: "包含する・網羅する", x: "The scope encompasses both aryl and alkyl substrates.", c: "verb" },
  { e: "comprise", j: "〜から成る・構成する", c: "verb" },
  { e: "constitute", j: "構成する・〜に相当する", c: "verb" },
  { e: "entail", j: "伴う・必然的に含む", x: "This route entails three additional steps.", c: "verb" },
  { e: "mitigate", j: "緩和する・軽減する", x: "Slow addition mitigates the side reaction.", c: "verb" },
  { e: "alleviate", j: "和らげる・軽減する", c: "verb" },
  { e: "exacerbate", j: "悪化させる・増悪させる", c: "verb" },
  { e: "underpin", j: "下支えする・基礎づける", c: "verb" },
  { e: "reconcile", j: "整合させる・調和させる", x: "These observations are difficult to reconcile with an ionic mechanism.", c: "verb" },
  { e: "bypass", j: "回避する・迂回する", x: "...the possibility of bypassing these rules via alternative mechanisms.", c: "verb" },
  { e: "circumvent", j: "回避する", x: "The cationic intermediate circumvents this constraint.", c: "verb" },
  { e: "override", j: "覆す・上回る", x: "Merging XAT and Co catalysis can override E2-selectivity.", c: "verb" },
  { e: "outperform", j: "〜より優れる", x: "Ag2CO3 outperformed other bases.", c: "verb" },
  { e: "preclude", j: "妨げる・排除する", x: "Two positive charges prevented experiments such as pyrolysis.", c: "verb" },
  { e: "hinder", j: "妨げる", c: "verb" },
  { e: "suppress", j: "抑制する", x: "TEMPO completely suppressed alkene formation.", c: "verb" },
  { e: "promote", j: "促進する", x: "FLP can be applied to promote transformations.", c: "verb" },
  { e: "facilitate", j: "促進する・容易にする", x: "Fluorine polarizes the π-system, facilitating MHAT.", c: "verb" },
  { e: "enable", j: "可能にする", x: "Bismuth redox catalysis enabled fluorination of esters.", c: "verb" },
  { e: "streamline", j: "効率化する・合理化する", x: "...streamlining downstream diversification.", c: "verb" },
  { e: "leverage", j: "活用する", x: "...motifs commonly leveraged in cross-coupling chemistry.", c: "verb" },
  { e: "harness", j: "活用する・利用する", x: "The functionalities have been extensively harnessed in catalysis.", c: "verb" },
  { e: "unveil", j: "明らかにする", x: "Efforts shifted to unveil the reactivity of first-row metals.", c: "verb" },
  { e: "address", j: "（課題に）取り組む", x: "This protocol addresses long-standing challenges.", c: "verb" },
  { e: "tackle", j: "取り組む", c: "verb" },
  { e: "embark on", j: "（研究などに）着手する・乗り出す", x: "We embarked on a chemical synthesis of the mangicols.", c: "verb" },
  { e: "commence", j: "始める・開始する", x: "Our synthesis commenced from known diketone 14.", c: "verb" },
  { e: "seek to", j: "〜しようとする・目指す", x: "We sought to develop a novel asymmetric approach.", c: "verb" },
  { e: "recognize", j: "認識する・見出す", x: "Recognizing that the A/B ring is conserved, we...", c: "verb" },
  { e: "exploit", j: "活用する・利用する", x: "A single intermediate is exploited in the construction of a collection.", c: "verb" },
  { e: "employ", j: "用いる・採用する", x: "Organometallic 20 was also employed in the next step.", c: "verb" },
  { e: "accomplish", j: "成し遂げる・達成する", x: "Carbomethoxylation was accomplished with phosgene–methanol.", c: "verb" },
  { e: "forge", j: "（結合・骨格を）作り上げる・築く", x: "Carbopalladation would forge the six-membered ring.", c: "verb" },
  { e: "mediate", j: "媒介する・仲介する", x: "Enzymes mediate a continuous series of catalytic cascades.", c: "verb" },
  { e: "shield", j: "遮蔽する・覆い隠す", x: "The naphthyl group shields the bottom face of the alkyne.", c: "verb" },
  { e: "partition", j: "（離れて）分かれる・分配する", x: "The acetylene would partition away from the bulky t-Bu group.", c: "verb" },
  { e: "decouple", j: "切り離す・分離する", x: "Ester 11 decouples the core from the side chain.", c: "verb" },
  { e: "rectify", j: "修正する・正す", x: "Late-stage installation was instrumental in rectifying the structure.", c: "verb" },
  { e: "stimulate", j: "刺激する・喚起する", x: "These sesterterpenoids have stimulated considerable interest.", c: "verb" },

  // ── 名詞 ──────────────────────────────
  { e: "transmetalation", j: "トランスメタル化", c: "noun" },
  { e: "oxidative addition", j: "酸化的付加", c: "noun" },
  { e: "reductive elimination", j: "還元的脱離", c: "noun" },
  { e: "redox cycle", j: "酸化還元サイクル", c: "noun" },
  { e: "catalytic cycle", j: "触媒サイクル", x: "We focused our attention on turning over the catalytic cycle.", c: "noun" },
  { e: "turnover", j: "触媒回転（ターンオーバー）", c: "noun" },
  { e: "intermediate", j: "中間体", x: "The formation of a cationic intermediate circumvents the constraint.", c: "noun" },
  { e: "transition state", j: "遷移状態", c: "noun" },
  { e: "homolysis", j: "ホモリシス（均一結合開裂）", x: "Homolytic cleavage of the Co–C bond generates an alkyl radical.", c: "noun" },
  { e: "β-hydride elimination", j: "β水素脱離", c: "noun" },
  { e: "migratory insertion", j: "移動挿入", x: "A stereochemistry-defining migratory insertion generates the rhodacycle.", c: "noun" },
  { e: "hydrogen atom transfer", j: "水素原子移動（HAT）", c: "noun" },
  { e: "abstraction", j: "引き抜き", x: "Light-driven β-hydrogen abstraction furnishes the olefin.", c: "noun" },
  { e: "cleavage", j: "開裂・切断", c: "noun" },
  { e: "deprotonation", j: "脱プロトン化", c: "noun" },
  { e: "coordination", j: "配位", c: "noun" },
  { e: "ligand", j: "配位子", c: "noun" },
  { e: "substrate", j: "基質", c: "noun" },
  { e: "nucleophile", j: "求核剤", c: "noun" },
  { e: "electrophile", j: "求電子剤", c: "noun" },
  { e: "oxidation state", j: "酸化数・酸化状態", c: "noun" },
  { e: "stereoretention", j: "立体保持", c: "noun" },
  { e: "racemization", j: "ラセミ化", x: "Dehydration proceeded without detectable racemization.", c: "noun" },
  { e: "cross-coupling", j: "クロスカップリング", c: "noun" },
  { e: "homodimerization", j: "ホモ二量化", x: "Competing insertion is disfavored, suppressing homodimerization.", c: "noun" },
  { e: "hydrofunctionalization", j: "ヒドロ官能基化", c: "noun" },
  { e: "kinetic profile", j: "反応速度プロファイル", c: "noun" },
  { e: "rate constant", j: "速度定数", c: "noun" },
  { e: "activation barrier", j: "活性化障壁", c: "noun" },
  { e: "enthalpy", j: "エンタルピー", c: "noun" },
  { e: "entropy", j: "エントロピー", x: "A large negative entropy is consistent with an associative process.", c: "noun" },
  { e: "Eyring analysis", j: "アイリング解析", c: "noun" },
  { e: "Hammett plot", j: "ハメットプロット", c: "noun" },
  { e: "substituent", j: "置換基", c: "noun" },
  { e: "kinetic isotope effect", j: "速度論的同位体効果（KIE）", c: "noun" },
  { e: "rate-determining step", j: "律速段階", x: "The alkene insertion is rate-determining.", c: "noun" },
  { e: "DFT calculations", j: "DFT計算", c: "noun" },
  { e: "free energy", j: "自由エネルギー", c: "noun" },
  { e: "spin state", j: "スピン状態", c: "noun" },
  { e: "electrostatic potential", j: "静電ポテンシャル", c: "noun" },
  { e: "control experiment", j: "対照実験", x: "Control experiments confirmed the catalyst is essential.", c: "noun" },
  { e: "radical clock", j: "ラジカル時計", c: "noun" },
  { e: "moiety", j: "部分構造・基", x: "A ligand featuring a sulfoximine moiety produced an active catalyst.", c: "noun" },
  { e: "scaffold", j: "骨格", x: "The honokiol scaffold underwent double elimination.", c: "noun" },
  { e: "framework", j: "骨格・枠組み", x: "...binding two anionic ligands in a cyclic framework.", c: "noun" },
  { e: "motif", j: "構造単位・モチーフ", x: "...accommodating a wide range of synthetically relevant motifs.", c: "noun" },
  { e: "feedstock", j: "原料・出発物質", x: "...the direct conversion of abundant feedstocks.", c: "noun" },
  { e: "building block", j: "構成要素・ビルディングブロック", x: "Olefins are among the most useful building blocks.", c: "noun" },
  { e: "precedent", j: "先例", x: "Building on precedents in Bi coordination chemistry...", c: "noun" },
  { e: "manifold", j: "（反応）様式・経路", x: "In the E2 manifold, β-elimination has a high barrier.", c: "noun" },
  { e: "platform", j: "基盤・プラットフォーム", x: "These strategies represent useful platforms for synthesis.", c: "noun" },
  { e: "handle", j: "取っ掛かり・反応点", x: "...substrates bearing synthetically versatile handles.", c: "noun" },
  { e: "regime", j: "領域・条件範囲", c: "noun" },
  { e: "array", j: "一連の・配列", x: "A diverse array of aryl-substituted derivatives was compatible.", c: "noun" },
  { e: "derivative", j: "誘導体", c: "noun" },
  { e: "analogue", j: "類縁体・アナログ", x: "...the 2,3-dibenzyl analogue reacted faster.", c: "noun" },
  { e: "surrogate", j: "代替物", x: "...a retrosynthetic surrogate for enolate alkylation.", c: "noun" },
  { e: "species", j: "化学種", x: "Smooth conversion to high-valent Bi(V) species was achieved.", c: "noun" },
  { e: "functionality", j: "官能基性・機能", x: "...tolerance of oxidation-sensitive functionalities.", c: "noun" },
  { e: "utility", j: "有用性", x: "We showcase the utility of these electrophiles.", c: "noun" },
  { e: "scope", j: "適用範囲（基質適用範囲）", x: "The reaction features a broad substrate scope.", c: "noun" },
  { e: "tolerance", j: "許容性", x: "...exceptional tolerance of oxidation-sensitive groups.", c: "noun" },
  { e: "diversification", j: "多様化", x: "...offering a powerful platform for scaffold diversification.", c: "noun" },
  { e: "late-stage functionalization", j: "後期段階修飾", x: "...enabling late-stage functionalization of drug molecules.", c: "noun" },
  { e: "rationale", j: "論拠・根拠", c: "noun" },
  { e: "premise", j: "前提・出発点", c: "noun" },
  { e: "caveat", j: "但し書き・注意点", c: "noun" },
  { e: "hallmark", j: "特徴・しるし", c: "noun" },
  { e: "bottleneck", j: "律速・ボトルネック", c: "noun" },
  { e: "regioselectivity", j: "位置選択性", c: "noun" },
  { e: "stereocontrol", j: "立体制御", x: "...capable of achieving both efficient activation and stereocontrol.", c: "noun" },
  { e: "enantiocontrol", j: "エナンチオ制御", c: "noun" },
  { e: "atom economy", j: "原子効率", x: "...suffers from inherently low atom economy.", c: "noun" },
  { e: "by-product", j: "副生成物", c: "noun" },
  { e: "side reaction", j: "副反応", x: "...hydrolysis seemed to become a dominant side reaction.", c: "noun" },
  { e: "congener", j: "同族体・近縁化合物", c: "noun" },
  { e: "subset", j: "部分集合・一部", c: "noun" },
  { e: "interplay", j: "相互作用・兼ね合い", c: "noun" },
  { e: "trade-off", j: "トレードオフ・両立し難い関係", x: "We identified a key trade-off between reactivity and stereocontrol.", c: "noun" },
  { e: "discrepancy", j: "不一致・食い違い", x: "All isomers showed significant discrepancies relative to the reported data.", c: "noun" },
  { e: "propensity", j: "傾向・性質", x: "...owing to the higher propensity of selenides to undergo β-elimination.", c: "noun" },
  { e: "artifact", j: "（測定・操作由来の）人工産物・アーティファクト", x: "Neomangicol C was suspected to be an artifact arising from loss of HX.", c: "noun" },
  { e: "blueprint", j: "設計図・青写真", x: "A general blueprint for the triquinane core construction.", c: "noun" },
  { e: "metabolite", j: "代謝産物", x: "...biosynthetically related metabolites were isolated.", c: "noun" },
  { e: "elucidation", j: "解明・構造決定", x: "Structural elucidation revealed an unprecedented framework.", c: "noun" },
  { e: "misassignment", j: "誤った帰属・構造の取り違え", x: "...suggesting a stereochemical misassignment of the side chain.", c: "noun" },

  // ── 形容詞 ──────────────────────────────
  { e: "regioselective", j: "位置選択的な", c: "adj" },
  { e: "stereoselective", j: "立体選択的な", c: "adj" },
  { e: "enantioselective", j: "エナンチオ選択的な", c: "adj" },
  { e: "chemoselective", j: "化学選択的な", c: "adj" },
  { e: "crystallographic", j: "結晶学的な", c: "adj" },
  { e: "first-order", j: "一次（反応）", x: "Decomposition exhibited a first-order kinetic profile.", c: "adj" },
  { e: "rate-limiting", j: "律速の", c: "adj" },
  { e: "coveted", j: "切望される・需要の高い", x: "This transformation is highly coveted in the pharmaceutical industry.", c: "adj" },
  { e: "elusive", j: "つかみどころのない・実現困難な", x: "A catalytic cycle remained elusive for Bi until now.", c: "adj" },
  { e: "feasible", j: "実現可能な", x: "This reaction is feasible using stoichiometric transition metals.", c: "adj" },
  { e: "viable", j: "実行可能な・成り立つ", x: "We demonstrated the viability of the thianthrenium dication.", c: "adj" },
  { e: "versatile", j: "汎用性の高い", x: "The salts are versatile electrophiles for cross-coupling.", c: "adj" },
  { e: "robust", j: "頑健な・安定した", x: "The catalyst showed robust catalytic reactivity.", c: "adj" },
  { e: "mild", j: "温和な（条件）", x: "Elimination occurs under mild conditions.", c: "adj" },
  { e: "general", j: "一般性のある", x: "The protocol proved general with a variety of substrates.", c: "adj" },
  { e: "unprecedented", j: "前例のない", c: "adj" },
  { e: "remarkable", j: "注目すべき・著しい", x: "Remarkably, the scaffold underwent double elimination.", c: "adj" },
  { e: "pronounced", j: "顕著な", x: "A pronounced α-secondary KIE was observed.", c: "adj" },
  { e: "modest", j: "中程度の・控えめな", x: "9-BBN furnished the product in a modest yield.", c: "adj" },
  { e: "marked", j: "著しい・はっきりした", x: "Regioselection was markedly shifted with BH3·NMe3.", c: "adj" },
  { e: "notable", j: "注目に値する", x: "A notable reduction in yield was observed.", c: "adj" },
  { e: "sluggish", j: "（反応が）遅い・鈍い", x: "A bulkier reagent was sluggish to react.", c: "adj" },
  { e: "facile", j: "容易な・たやすい", x: "The substrate underwent facile ring fission.", c: "adj" },
  { e: "amenable to", j: "〜に適している・受け入れられる", x: "Sterically hindered substitution was also amenable to fluorination.", c: "adj" },
  { e: "challenging", j: "困難な・手強い", x: "Substitution at the meta-position presented more difficulties.", c: "adj" },
  { e: "formidable", j: "手強い・困難な", x: "Stereocontrol of inert C–H bonds poses formidable challenges.", c: "adj" },
  { e: "straightforward", j: "単純明快な・容易な", x: "The reaction is straightforward to execute.", c: "adj" },
  { e: "inherent", j: "本来的な・固有の", x: "The route suffers from inherently low atom economy.", c: "adj" },
  { e: "intrinsic", j: "本質的な・内在的な", x: "Substrate-specific local properties govern selectivity.", c: "adj" },
  { e: "broad", j: "広範な", x: "This method displays broad substrate scope.", c: "adj" },
  { e: "scalable", j: "スケール可能な", x: "Chlorination was performed on gram scale.", c: "adj" },
  { e: "compelling", j: "説得力のある", c: "adj" },
  { e: "striking", j: "際立った・印象的な", c: "adj" },
  { e: "subtle", j: "微妙な・わずかな", x: "...two acrylates with minimal structural and electronic differences.", c: "adj" },
  { e: "negligible", j: "無視できるほどの", x: "...leading to negligible desired alkene products.", c: "adj" },
  { e: "substantial", j: "かなりの・相当な", x: "A substantial amount of the 4,6-diol was present.", c: "adj" },
  { e: "appreciable", j: "認め得るほどの・かなりの", c: "adj" },
  { e: "comparable", j: "同程度の", x: "Our conditions afforded comparable yields.", c: "adj" },
  { e: "divergent", j: "分岐する・異なる", x: "Martin sulfurane exhibited divergent reactivity.", c: "adj" },
  { e: "complementary", j: "相補的な", c: "adj" },
  { e: "orthogonal", j: "直交した・独立に操作できる", x: "...allows orthogonal functional-group manipulation.", c: "adj" },
  { e: "detrimental", j: "有害な・悪影響の", c: "adj" },
  { e: "cumbersome", j: "煩雑な・扱いにくい", c: "adj" },
  { e: "well-defined", j: "明確に規定された", x: "...with well-defined substitution patterns along the backbone.", c: "adj" },
  { e: "underexplored", j: "未開拓の・あまり調べられていない", x: "...a main-group element with under-explored redox properties.", c: "adj" },
  { e: "plausible", j: "もっともらしい・妥当な", x: "A plausible mechanism involves a radical intermediate.", c: "adj" },
  { e: "prominent", j: "顕著な・主要な", c: "adj" },
  { e: "predominant", j: "支配的な・主要な", c: "adj" },
  { e: "pivotal", j: "中心的な・要となる", c: "adj" },
  { e: "crucial", j: "極めて重要な", c: "adj" },
  { e: "ambiguous", j: "曖昧な・多義的な", c: "adj" },
  { e: "unambiguous", j: "明確な・曖昧さのない", x: "X-ray analysis provided unambiguous structural assignment.", c: "adj" },
  { e: "prevalent", j: "広く見られる・普及した", c: "adj" },
  { e: "ubiquitous", j: "遍在する・至る所にある", x: "Amide bonds are ubiquitous in natural products.", c: "adj" },
  { e: "arbitrary", j: "恣意的な・任意の", c: "adj" },
  { e: "analogous", j: "類似した・相似の", x: "An analogous trend was observed for the bromide.", c: "adj" },
  { e: "salient", j: "顕著な・際立った", x: "The salient features are summarized in Table 1.", c: "adj" },
  { e: "tentative", j: "暫定的な・試験的な", c: "adj" },
  { e: "profound", j: "深遠な・重大な", c: "adj" },
  { e: "definitive", j: "決定的な・確定的な", c: "adj" },
  { e: "coherent", j: "首尾一貫した・整合的な", c: "adj" },
  { e: "explicit", j: "明示的な・明確な", c: "adj" },
  { e: "implicit", j: "暗黙の・含意された", c: "adj" },
  { e: "adequate", j: "十分な・適切な", c: "adj" },
  { e: "distinct", j: "明確に異なる・別個の", x: "Two distinct pathways were identified.", c: "adj" },
  { e: "discrete", j: "個別の・離散的な", c: "adj" },
  { e: "diverse", j: "多様な", c: "adj" },
  { e: "pertinent", j: "関連する・適切な", c: "adj" },
  { e: "requisite", j: "必要な・必須の", x: "...an intermediate endowed with the requisite functionality.", c: "adj" },
  { e: "expedient", j: "迅速な・効率的な", x: "...the expedient, asymmetric total syntheses of six alkaloids.", c: "adj" },
  { e: "prolific", j: "豊富な・多産な", x: "Fungi are prolific sources of secondary metabolites.", c: "adj" },
  { e: "concise", j: "簡潔な・無駄のない", x: "...to establish the framework in a concise manner.", c: "adj" },
  { e: "conserved", j: "（構造などが）保存された・共通の", x: "The A/B ring system is conserved across the mangicol family.", c: "adj" },
  { e: "intriguing", j: "興味をそそる・興味深い", x: "...an important consideration for these intriguing targets.", c: "adj" },
  { e: "novel", j: "新規の・斬新な", x: "They identified two novel halogenated sesterterpenoids.", c: "adj" },
  { e: "considerable", j: "かなりの・相当な", x: "These metabolites have stimulated considerable interest.", c: "adj" },
  { e: "instrumental", j: "（〜に）大きく寄与する・重要な", x: "Late-stage installation proved instrumental in the revision.", c: "adj" },
  { e: "latent", j: "潜在的な・まだ表に出ていない", x: "With a latent carbonyl and an appended alkyne in place...", c: "adj" },
  { e: "appended", j: "付加された・取り付けられた", x: "...a latent carbonyl and an appended alkyne.", c: "adj" },
  { e: "pendant", j: "（側鎖として）垂れ下がった・懸垂した", x: "5-exo-heterocyclization of the pendant carbamate occurred.", c: "adj" },
  { e: "proximal", j: "近位の・近くの", x: "...lactol formation with the proximal alcohol-bearing side chain.", c: "adj" },
  { e: "ensuing", j: "それに続いて生じる・直後の", x: "...trapping of the ensuing C(sp3)–Pd(II) intermediate.", c: "adj" },

  // ── 副詞 ──────────────────────────────
  { e: "herein", j: "本論文では；ここに", x: "Herein, we report a catalytic fluorination of arylboronic esters.", c: "adv" },
  { e: "notably", j: "特筆すべきことに", x: "Notably, no formation of the undesired salt was detected.", c: "adv" },
  { e: "importantly", j: "重要なことに", c: "adv" },
  { e: "crucially", j: "決定的に重要なことに", x: "Crucially, the carbonyl coordinates to the metal center.", c: "adv" },
  { e: "specifically", j: "具体的には", c: "adv" },
  { e: "presumably", j: "おそらく・推定では", c: "adv" },
  { e: "arguably", j: "おそらく・ほぼ間違いなく", c: "adv" },
  { e: "ostensibly", j: "表向きは・一見", c: "adv" },
  { e: "predominantly", j: "主に・大部分は", c: "adv" },
  { e: "invariably", j: "常に・例外なく", c: "adv" },
  { e: "inevitably", j: "必然的に・避けがたく", c: "adv" },
  { e: "essentially", j: "本質的には・要するに", c: "adv" },
  { e: "ultimately", j: "最終的には・結局", c: "adv" },
  { e: "collectively", j: "総じて・まとめて", x: "Collectively, these results support a stepwise mechanism.", c: "adv" },
  { e: "respectively", j: "それぞれ", x: "Yields were 85% and 72%, respectively.", c: "adv" },
  { e: "relatively", j: "比較的", c: "adv" },
  { e: "considerably", j: "かなり・相当に", c: "adv" },
  { e: "markedly", j: "著しく・はっきりと", c: "adv" },
  { e: "seemingly", j: "一見・見たところ", c: "adv" },
  { e: "evidently", j: "明らかに", c: "adv" },
  { e: "substantially", j: "大幅に・実質的に", c: "adv" },
  { e: "solely", j: "もっぱら・〜だけ", c: "adv" },
  { e: "merely", j: "単に・〜にすぎない", c: "adv" },
  { e: "largely", j: "主に・大部分は", c: "adv" },
  { e: "hitherto", j: "これまで（は）", c: "adv" },
  { e: "cautiously", j: "慎重に・控えめに", x: "The stereocenters were cautiously proposed as S-configured.", c: "adv" },
  { e: "transiently", j: "一時的に・過渡的に", x: "Iminium 5 might cyclize to give pyrroloindoline 7 transiently.", c: "adv" },
  { e: "concomitantly", j: "同時に・付随して", x: "Both alkynyl TMS groups were concomitantly removed.", c: "adv" },
  { e: "selectively", j: "選択的に", x: "The ester was selectively reduced to the diene.", c: "adv" },
  { e: "readily", j: "容易に・すぐに", x: "...readily accomplished with unprecedented efficiency.", c: "adv" },

  // ── 接続・つなぎ ──────────────────────────────
  { e: "hence", j: "それゆえ・したがって", c: "conn" },
  { e: "thereby", j: "それによって", x: "...rendering the Bi center electrophilic, thereby prone to transmetalation.", c: "conn" },
  { e: "thus", j: "したがって・このように", c: "conn" },
  { e: "whereas", j: "一方で・〜であるのに対し", x: "Borane opens at O6, whereas silane opens at O4.", c: "conn" },
  { e: "however", j: "しかしながら", c: "conn" },
  { e: "nevertheless", j: "それにもかかわらず", c: "conn" },
  { e: "nonetheless", j: "それでもなお", c: "conn" },
  { e: "furthermore", j: "さらに・その上", c: "conn" },
  { e: "moreover", j: "さらに・加えて", c: "conn" },
  { e: "in contrast", j: "対照的に", c: "conn" },
  { e: "in stark contrast", j: "際立って対照的に", x: "This stands in stark contrast to previous reports.", c: "conn" },
  { e: "by contrast", j: "対照的に", x: "By contrast, the synthesis of glutarates can occur without base.", c: "conn" },
  { e: "consistent with", j: "〜と一致して", x: "The value is consistent with an associative process.", c: "conn" },
  { e: "in agreement with", j: "〜と一致して", x: "This is in good agreement with the experimental reactivity.", c: "conn" },
  { e: "akin to", j: "〜に似て・〜と同様に", x: "Bi cycles in a manner akin to transition metals.", c: "conn" },
  { e: "to this end", j: "この目的のために", x: "To this end, we focused on oxidative fluorination.", c: "conn" },
  { e: "on the basis of", j: "〜に基づいて", x: "On the basis of the crystallographic information, we anticipated...", c: "conn" },
  { e: "with the goal of", j: "〜を目標として", x: "With the goal of turning over the cycle, we focused on transmetalation.", c: "conn" },
  { e: "with the aim of", j: "〜を目指して", x: "With the aim of exploring the scope, transmetalation was surveyed.", c: "conn" },
  { e: "owing to", j: "〜のために・〜に起因して", x: "...owing to the weakly coordinating nature of the ligand.", c: "conn" },
  { e: "by virtue of", j: "〜のおかげで・〜によって", c: "conn" },
  { e: "in light of", j: "〜を踏まえて", x: "In light of these environmental concerns, alternatives were sought.", c: "conn" },
  { e: "with respect to", j: "〜に関して", x: "...the high selectivity with respect to double-bond geometry.", c: "conn" },
  { e: "in the presence of", j: "〜の存在下で", x: "A slower rate was obtained in the presence of fluoride anions.", c: "conn" },
  { e: "in the absence of", j: "〜の非存在下で", x: "In the absence of light, hydrogenation dominates.", c: "conn" },
  { e: "albeit", j: "〜ではあるが", x: "...albeit with partial decomposition observed.", c: "conn" },
  { e: "despite", j: "〜にもかかわらず", c: "conn" },
  { e: "notwithstanding", j: "〜にもかかわらず", c: "conn" },
  { e: "to date", j: "今日まで・これまでに", x: "...only isolated successes to date.", c: "conn" },
  { e: "wherein", j: "その中で（関係副詞）", x: "...intermediates wherein the carboxylate served as the nucleophile.", c: "conn" },
  { e: "conversely", j: "逆に", c: "conn" },
  { e: "likewise", j: "同様に", x: "We hypothesized that a radical mechanism might likewise enable it.", c: "conn" },
  { e: "similarly", j: "同様に", c: "conn" },
  { e: "accordingly", j: "それに応じて・したがって", x: "Accordingly, we chose a tethered bis-anionic aryl ligand.", c: "conn" },
  { e: "consequently", j: "その結果", c: "conn" },
  { e: "subsequently", j: "その後・続いて", x: "Subsequently, II could be oxidized to a high-valent compound.", c: "conn" },
  { e: "thereafter", j: "その後・以降", c: "conn" },
  { e: "in particular", j: "特に", c: "conn" },
  { e: "in principle", j: "原理的には", c: "conn" },
  { e: "in practice", j: "実際には", c: "conn" },
  { e: "for instance", j: "例えば", c: "conn" },
  { e: "namely", j: "すなわち", c: "conn" },
  { e: "as such", j: "そのため・それ自体として", x: "As such, practical methods remain exceedingly rare.", c: "conn" },
  { e: "given that", j: "〜を考えると", c: "conn" },
  { e: "provided that", j: "〜という条件で", c: "conn" },
  { e: "such that", j: "〜となるように", c: "conn" },
  { e: "as a result", j: "結果として", c: "conn" },
  { e: "on the one hand", j: "一方では", c: "conn" },
  { e: "on the other hand", j: "他方では", c: "conn" },
  { e: "analogously", j: "類似して・同様に", c: "conn" },
  { e: "alternatively", j: "あるいは・代わりに", c: "conn" },
  { e: "in comparison with", j: "〜と比べて", x: "Selenides eliminate more readily in comparison with sulfides.", c: "conn" },
  { e: "in accordance with", j: "〜と一致して・〜に従って", x: "The NMR data were in complete accordance with natural mangicol D.", c: "conn" },
  { e: "by analogy", j: "類推によって・同様に考えて", x: "The structures were all assigned by analogy.", c: "conn" },

  // ── 句動詞・熟語 ──────────────────────────────
  { e: "report on", j: "〜について報告する", x: "Our group reported on an Ni-catalyzed cross-coupling.", c: "phr" },
  { e: "reason that", j: "（〜だと）推論する", x: "We reasoned that the polarization facilitates the MHAT step.", c: "phr" },
  { e: "attribute to", j: "〜に帰属させる・〜のせいにする", x: "The high conversion was attributed to the labile ligand.", c: "phr" },
  { e: "ascribe to", j: "〜に帰する", x: "Elimination could be ascribed to the low coordinating ability.", c: "phr" },
  { e: "point out", j: "指摘する", c: "phr" },
  { e: "set out to", j: "〜に着手する", x: "We set out to prepare a complex mimicking transition metals.", c: "phr" },
  { e: "result in", j: "〜という結果になる", x: "Attempts to thermally induce C–F formation resulted in decomposition.", c: "phr" },
  { e: "lead to", j: "〜につながる", c: "phr" },
  { e: "bring about", j: "もたらす・引き起こす", c: "phr" },
  { e: "remain intact", j: "そのまま保たれる", x: "Reactive moieties remained intact under these conditions.", c: "phr" },
  { e: "give rise to", j: "引き起こす・生じさせる", x: "The cationic substituent gives rise to selective monofunctionalization.", c: "phr" },
  { e: "account for", j: "説明する・占める", x: "Oxidation would need to be faster to account for the selectivity.", c: "phr" },
  { e: "rule out", j: "排除する・否定する", x: "We cannot rule out an addition of the radical cation.", c: "phr" },
  { e: "take advantage of", j: "利用する・活かす", x: "We sought to take advantage of Bi's capacity for extra ligands.", c: "phr" },
  { e: "capitalize on", j: "活用する", x: "Capitalizing on KF as activator, transmetalation took place.", c: "phr" },
  { e: "in its infancy", j: "黎明期にある・発展途上の", x: "Main-group redox catalysis is still in its infancy.", c: "phr" },
  { e: "on a gram scale", j: "グラムスケールで", x: "Chlorination was performed successfully on gram scale.", c: "phr" },
  { e: "set the stage for", j: "〜の下地を整える・お膳立てする", x: "Triflation set the stage for A-ring assembly.", c: "phr" },
  { e: "fill the gap", j: "隙間を埋める", x: "Here we fill this gap and showcase the utility of the salts.", c: "phr" },
  { e: "hold promise", j: "有望である", c: "phr" },
  { e: "at the expense of", j: "〜を犠牲にして", c: "phr" },
  { e: "readily available", j: "入手容易な", x: "...a readily available CoCl2/dmgH2 catalyst system.", c: "phr" },
  { e: "well-established", j: "確立された", x: "...well-established methods such as Brown hydroboration.", c: "phr" },
  { e: "a major challenge", j: "主要な課題", x: "It remains a major challenge in organometallic chemistry.", c: "phr" },
  { e: "step- and atom-economical", j: "ステップ・原子効率的な", x: "...offering step- and atom-economical access to chiral molecules.", c: "phr" },
  { e: "give access to", j: "〜への道を開く", x: "This afforded access to four of the eight diastereomers.", c: "phr" },
  { e: "by means of", j: "〜によって・〜を用いて", c: "phr" },
  { e: "in turn", j: "今度は・ひいては", c: "phr" },
  { e: "in parallel", j: "並行して", x: "In parallel, the Wang group developed an Indx-Rh catalysis.", c: "phr" },
  { e: "at the outset", j: "最初に・冒頭で", c: "phr" },
  { e: "prone to", j: "〜しやすい・〜の傾向がある", x: "Acrylate substrates are prone to uncontrolled polymerization.", c: "phr" },
  { e: "reminiscent of", j: "〜を想起させる", c: "phr" },
  { e: "contingent on", j: "〜に依存する", c: "phr" },
  { e: "shed light on", j: "解明する・光を当てる", c: "phr" },
  { e: "pave the way", j: "道を開く・地ならしする", x: "A detailed study paved the way to a catalytic cycle.", c: "phr" },
  { e: "a step forward", j: "一歩前進", x: "This mode of reactivity represents a step forward.", c: "phr" },
  { e: "in line with", j: "〜と一致して", x: "The barrier is in line with the observed reactivity.", c: "phr" },
  { e: "in keeping with", j: "〜に沿って・〜と整合して", c: "phr" },
  { e: "at odds with", j: "〜と矛盾して", x: "These results are at odds with an ionic pathway.", c: "phr" },
  { e: "on par with", j: "〜と同等で", c: "phr" },
  { e: "play a role", j: "役割を果たす", x: "Light plays a critical role in steering the reaction.", c: "phr" },
  { e: "play a pivotal role", j: "極めて重要な役割を果たす", c: "phr" },
  { e: "hold true", j: "当てはまる・成り立つ", c: "phr" },
  { e: "provide insight into", j: "〜への洞察を与える", x: "Mechanistic studies provide insight into the selectivity.", c: "phr" },
  { e: "gain insight into", j: "〜への洞察を得る", x: "We attempted to gain further insight into the mechanism.", c: "phr" },
  { e: "lend support to", j: "〜を支持する", c: "phr" },
  { e: "provide evidence for", j: "〜の証拠を与える", x: "These results provide additional evidence for a cationic species.", c: "phr" },
  { e: "be governed by", j: "〜に支配される", x: "Reductive elimination is governed by orbital symmetry rules.", c: "phr" },
  { e: "be dictated by", j: "〜によって決まる", x: "Stereoelectronic considerations dictate the elimination pathway.", c: "phr" },
  { e: "hinge on", j: "〜にかかっている・依存する", c: "phr" },
  { e: "draw on", j: "〜を活用する・拠り所にする", c: "phr" },
  { e: "build upon", j: "〜を基盤にする", x: "Building on precedents in coordination chemistry...", c: "phr" },
  { e: "take into account", j: "考慮に入れる", x: "...excellent linearity when resonance effects are considered.", c: "phr" },
  { e: "with this in mind", j: "これを踏まえて", x: "With these considerations in mind, we synthesized bismine 1.", c: "phr" },
  { e: "in this regard", j: "この点で", c: "phr" },
  { e: "en route to", j: "〜に至る途中で", c: "phr" },
  { e: "in one step", j: "一段階で", x: "Methods from alkynes can afford alkenyl halides in one step.", c: "phr" },
  { e: "in a stepwise manner", j: "段階的に", c: "phr" },
  { e: "in a concerted fashion", j: "協奏的に", c: "phr" },
  { e: "give way to", j: "〜に取って代わられる", c: "phr" },
  { e: "come into play", j: "関与してくる・働き始める", c: "phr" },
  { e: "be of interest", j: "関心が持たれる", c: "phr" },
  { e: "stand in contrast to", j: "〜と対照をなす", x: "This stands in stark contrast to previous reports.", c: "phr" },
  { e: "lay the foundation for", j: "〜の基礎を築く", c: "phr" },
  { e: "open up new avenues", j: "新たな道を切り開く", c: "phr" },
  { e: "align with", j: "〜と一致する・整合する", x: "The data align with a concerted pathway.", c: "phr" },
  { e: "pertain to", j: "〜に関係する・該当する", c: "phr" },
  { e: "set in motion", j: "始動させる・動き出させる", x: "Exposure to propynal would set in motion a Diels–Alder addition.", c: "phr" },
  { e: "bode well for", j: "〜にとって良い兆しである", x: "...features which bode well for future syntheses.", c: "phr" },
  { e: "in the event", j: "実際には・いざやってみると", x: "In the event, treatment of 19 gave the natural product.", c: "phr" },
  { e: "poised to", j: "（今にも）〜する態勢にある", x: "The cycloadduct would be poised to undergo β-elimination.", c: "phr" },
  { e: "endowed with", j: "〜を備えた・授かった", x: "...an intermediate endowed with the requisite functionality.", c: "phr" },

  // ── 定型・発表表現 ──────────────────────────────
  { e: "I'd like to present...", j: "〜を発表したいと思います", c: "expr" },
  { e: "As you can see in Figure...", j: "図に示すように", c: "expr" },
  { e: "Let me draw your attention to...", j: "〜に注目してください", c: "expr" },
  { e: "In this slide...", j: "このスライドでは", c: "expr" },
  { e: "To summarize...", j: "まとめると", c: "expr" },
  { e: "In conclusion...", j: "結論として", c: "expr" },
  { e: "In summary", j: "要約すると・まとめると", x: "In summary, we describe the first asymmetric synthesis.", c: "expr" },
  { e: "future directions", j: "今後の展望", c: "expr" },
  { e: "ongoing work", j: "進行中の研究", c: "expr" },
  { e: "I'd be happy to take questions", j: "ご質問をお受けします", c: "expr" },
  { e: "That's a great question", j: "良いご質問です", c: "expr" },
  { e: "If I understand correctly...", j: "私の理解が正しければ", c: "expr" },
  { e: "Let me get back to you on that", j: "その点は後ほどお答えします", c: "expr" },
  { e: "as a follow-up", j: "続けて・補足として", c: "expr" },
  { e: "building on...", j: "〜を基盤として・発展させて", c: "expr" },
  { e: "we set out to...", j: "〜に着手した・取り組んだ", x: "We set out to prepare a Bi complex mimicking transition metals.", c: "expr" },
  { e: "to the best of our knowledge", j: "我々の知る限り", c: "expr" },
  { e: "proof of concept", j: "概念実証", x: "Proof-of-concept studies established the feasibility.", c: "expr" },
  { e: "preliminary results", j: "予備的な結果", c: "expr" },
  { e: "let me elaborate", j: "もう少し詳しく説明します", c: "expr" },
  { e: "I'll come back to this later", j: "この点は後ほど触れます", c: "expr" },
  { e: "as outlined above", j: "上で概説したとおり", c: "expr" },
  { e: "as mentioned earlier", j: "先に述べたように", c: "expr" },
  { e: "in the interest of time", j: "時間の都合上", c: "expr" },
  { e: "to put it simply", j: "簡単に言えば", c: "expr" },
  { e: "in a nutshell", j: "要するに", c: "expr" },
  { e: "the take-home message", j: "要点・持ち帰ってほしい点", c: "expr" },
  { e: "we believe that...", j: "我々は〜と考えます", c: "expr" },
  { e: "let me elaborate on...", j: "〜について詳しく説明します", c: "expr" },
  { e: "moving on to...", j: "次に〜に移ります", c: "expr" },
  { e: "I'll skip the details", j: "詳細は割愛します", c: "expr" },

];

const STORE_KEY = "acadvocab:v2";

export default function App() {
  const [view, setView] = useState("home"); // home | flash | quiz | browse
  const [cat, setCat] = useState("all");
  const [progress, setProgress] = useState({}); // { english: 'known' | 'learning' }
  const [loaded, setLoaded] = useState(false);

  // load progress
  useEffect(() => {
    try {
      const v = localStorage.getItem(STORE_KEY);
      if (v) setProgress(JSON.parse(v));
    } catch (e) { /* first run / unavailable / private mode */ }
    setLoaded(true);
  }, []);

  const saveProgress = useCallback((next) => {
    setProgress(next);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); }
    catch (e) { /* keep in memory */ }
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

/* ---------- 品詞選択チップ ---------- */
function CatPicker({ cat, setCat }) {
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

/* ---------- ホーム ---------- */
function Home({ stats, cat, setCat, go }) {
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

        {/* 反応座標風プログレスバー */}
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

/* ---------- フラッシュカード ---------- */
function Flash({ deck, cat, setCat, progress, mark }) {
  const [order, setOrder] = useState(() => deck.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => { setOrder(deck.map((_, i) => i)); setPos(0); setFlipped(false); }, [deck]);

  if (deck.length === 0) return <Empty />;

  const idx = order[pos] ?? 0;
  const card = deck[idx];
  const meta = CATS[card.c];
  const status = progress[card.e];

  const next = () => { setFlipped(false); setPos((p) => (p + 1) % deck.length); };
  const prev = () => { setFlipped(false); setPos((p) => (p - 1 + deck.length) % deck.length); };
  const shuffle = () => {
    const a = deck.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    setOrder(a); setPos(0); setFlipped(false);
  };
  const handleMark = (s) => { mark(card.e, s); next(); };

  return (
    <div className="study">
      <div className="study-top">
        <CatPicker cat={cat} setCat={setCat} />
        <div className="study-meta">
          <span className="counter">{pos + 1} / {deck.length}</span>
          <button className="ghost" onClick={shuffle}>↻ シャッフル</button>
        </div>
      </div>

      <div className={flipped ? "card flipped" : "card"} onClick={() => setFlipped((f) => !f)}>
        <div className="card-inner">
          <div className="card-face card-front">
            <span className="card-tab" style={{ background: meta.color }}>{meta.label}</span>
            {status && <span className={"badge " + status}>{status === "known" ? "習得" : "復習中"}</span>}
            <div className="word">{card.e}</div>
            <div className="tap-hint">タップで意味を表示</div>
          </div>
          <div className="card-face card-back">
            <span className="card-tab" style={{ background: meta.color }}>{meta.label}</span>
            <div className="meaning">{card.j}</div>
            {card.x && <div className="example"><span className="ex-en">{card.x}</span></div>}
            <div className="word-small">{card.e}</div>
          </div>
        </div>
      </div>

      <div className="study-controls">
        <button className="ctrl" onClick={prev}>← 前へ</button>
        <button className="ctrl learn" onClick={() => handleMark("learning")}>要復習</button>
        <button className="ctrl know" onClick={() => handleMark("known")}>覚えた</button>
        <button className="ctrl" onClick={next}>次へ →</button>
      </div>
    </div>
  );
}

/* ---------- クイズ ---------- */
function makeQuestion(deck, pool) {
  const q = deck[Math.floor(Math.random() * deck.length)];
  const askEnToJa = Math.random() < 0.5;
  const opts = new Set([askEnToJa ? q.j : q.e]);
  let guard = 0;
  while (opts.size < 4 && guard < 200) {
    const r = pool[Math.floor(Math.random() * pool.length)];
    opts.add(askEnToJa ? r.j : r.e);
    guard++;
  }
  const arr = Array.from(opts);
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return { q, askEnToJa, options: arr, answer: askEnToJa ? q.j : q.e };
}

function Quiz({ deck, cat, setCat, mark }) {
  const pool = DATA;
  const [qst, setQst] = useState(null);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const newQ = useCallback(() => {
    if (deck.length < 2) { setQst(null); return; }
    setPicked(null);
    setQst(makeQuestion(deck, pool));
  }, [deck, pool]);

  useEffect(() => { setScore({ right: 0, total: 0 }); newQ(); }, [deck, newQ]);

  if (deck.length < 4) return <Empty msg="クイズには各品詞で4語以上が必要です。「すべて」か別の品詞を選んでください。" cat={cat} setCat={setCat} />;
  if (!qst) return <Empty />;

  const choose = (opt) => {
    if (picked) return;
    setPicked(opt);
    const correct = opt === qst.answer;
    setScore((s) => ({ right: s.right + (correct ? 1 : 0), total: s.total + 1 }));
    mark(qst.q.e, correct ? "known" : "learning");
  };

  const meta = CATS[qst.q.c];
  return (
    <div className="study">
      <div className="study-top">
        <CatPicker cat={cat} setCat={setCat} />
        <div className="study-meta">
          <span className="counter">スコア {score.right} / {score.total}</span>
        </div>
      </div>

      <div className="quiz">
        <div className="quiz-prompt">
          <span className="card-tab" style={{ background: meta.color }}>{meta.label}</span>
          <p className="quiz-label">{qst.askEnToJa ? "この語の意味は？" : "この意味の英語は？"}</p>
          <div className="quiz-q">{qst.askEnToJa ? qst.q.e : qst.q.j}</div>
        </div>

        <div className="quiz-options">
          {qst.options.map((opt) => {
            let cls = "opt";
            if (picked) {
              if (opt === qst.answer) cls += " correct";
              else if (opt === picked) cls += " wrong";
              else cls += " dim";
            }
            return (
              <button key={opt} className={cls} onClick={() => choose(opt)}>{opt}</button>
            );
          })}
        </div>

        {picked && (
          <div className="quiz-foot">
            {qst.q.x && <p className="quiz-ex">{qst.q.x}</p>}
            <button className="cta cta-primary" onClick={newQ}>次の問題 →</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- 一覧 ---------- */
function Browse({ cat, setCat, progress, mark }) {
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

function Empty({ msg, cat, setCat }) {
  return (
    <div className="study">
      {cat !== undefined && <div className="study-top"><CatPicker cat={cat} setCat={setCat} /></div>}
      <p className="empty-line">{msg || "この条件のカードはありません。"}</p>
    </div>
  );
}

/* ---------- スタイル ---------- */
function Style() {
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
.app::before{ /* paper tint over grid */
  content:""; position:fixed; inset:0; background:rgba(234,238,242,0.55); pointer-events:none; z-index:0;
}
.topbar,.main{ position:relative; z-index:1; }

/* top bar */
.topbar{
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 20px; background:rgba(255,255,255,0.85); backdrop-filter:blur(8px);
  border-bottom:1px solid var(--line); position:sticky; top:0; z-index:5;
}
.brand{ display:flex; align-items:center; gap:9px; cursor:pointer; }
.flask{ font-size:22px; color:var(--cobalt); }
.brand-name{ font-family:'Fraunces',serif; font-weight:700; font-size:19px; letter-spacing:-.01em; }
.dot{ color:var(--cobalt); }
.nav{ display:flex; gap:4px; flex-wrap:wrap; }
.nav button{
  font-family:'Inter'; font-size:13.5px; font-weight:600; color:var(--muted);
  background:transparent; border:none; padding:7px 12px; border-radius:8px; cursor:pointer;
}
.nav button:hover{ background:var(--cobalt-soft); color:var(--cobalt); }
.nav button.on{ background:var(--cobalt); color:#fff; }

.main{ max-width:880px; margin:0 auto; padding:26px 20px 80px; }
.loading,.empty-line{ color:var(--muted); padding:40px 8px; text-align:center; font-size:15px; }

/* hero */
.eyebrow{ font-family:'JetBrains Mono',monospace; font-size:11.5px; letter-spacing:.18em;
  text-transform:uppercase; color:var(--cobalt); margin-bottom:14px; }
.title{ font-family:'Fraunces',serif; font-weight:700; font-size:clamp(30px,6vw,46px);
  line-height:1.08; letter-spacing:-.02em; margin-bottom:16px; }
.title .accent{ color:var(--cobalt); position:relative; }
.title .accent::after{ content:""; position:absolute; left:0; right:0; bottom:4px; height:9px;
  background:rgba(37,82,217,.16); z-index:-1; }
.lede{ color:var(--muted); font-size:15.5px; max-width:62ch; margin-bottom:26px; }

/* reaction-coordinate progress */
.coord{ margin:6px 0 26px; }
.coord-track{ position:relative; height:6px; background:var(--line); border-radius:99px; }
.coord-fill{ position:absolute; left:0; top:0; bottom:0; background:linear-gradient(90deg,#4F79EE,var(--cobalt)); border-radius:99px; transition:width .5s ease; }
.coord-knob{ position:absolute; top:50%; width:14px; height:14px; background:#fff; border:3px solid var(--cobalt);
  border-radius:50%; transform:translate(-50%,-50%); transition:left .5s ease; }
.coord-labels{ display:flex; justify-content:space-between; margin-top:12px;
  font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted); }
.coord-labels .mid{ color:var(--amber); }

.cta-row{ display:flex; gap:10px; flex-wrap:wrap; }
.cta{ font-family:'Inter'; font-weight:600; font-size:14.5px; padding:11px 18px; border-radius:10px;
  border:1px solid var(--line); background:var(--surface); color:var(--ink); cursor:pointer; }
.cta:hover{ border-color:var(--cobalt); color:var(--cobalt); }
.cta-primary{ background:var(--cobalt); color:#fff; border-color:var(--cobalt); }
.cta-primary:hover{ background:#1c45bd; color:#fff; }

/* category section */
.picker-block{ margin-top:46px; border-top:1px solid var(--line); padding-top:30px; }
.h2{ font-family:'Fraunces',serif; font-weight:600; font-size:22px; }
.sub{ color:var(--muted); font-size:13.5px; margin:4px 0 16px; }
.chips{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; }
.chip{ font-family:'Inter'; font-size:12.5px; font-weight:600; padding:6px 12px; border-radius:99px;
  background:var(--surface); border:1px solid var(--line); color:var(--muted); cursor:pointer; }
.chip-on{ background:var(--ink); color:#fff; border-color:var(--ink); }

.cat-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:12px; }
.cat-card{ display:flex; background:var(--surface); border:1px solid var(--line); border-radius:12px;
  overflow:hidden; cursor:pointer; transition:transform .12s ease, box-shadow .12s ease; }
.cat-card:hover{ transform:translateY(-2px); box-shadow:0 8px 22px rgba(21,33,43,.08); }
.cat-spine{ width:7px; flex:none; }
.cat-body{ padding:14px 16px; }
.cat-label{ font-weight:600; font-size:15px; }
.cat-count{ font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted); margin-top:3px; }

/* study common */
.study,.browse{ display:flex; flex-direction:column; }
.study-top{ margin-bottom:18px; }
.study-meta{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
.counter{ font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--muted); }
.ghost{ background:transparent; border:1px solid var(--line); border-radius:8px; padding:6px 12px;
  font-family:'Inter'; font-size:13px; font-weight:600; color:var(--muted); cursor:pointer; }
.ghost:hover{ border-color:var(--cobalt); color:var(--cobalt); }

/* flashcard */
.card{ perspective:1400px; cursor:pointer; margin:6px 0 22px; }
.card-inner{ position:relative; width:100%; min-height:280px; transform-style:preserve-3d;
  transition:transform .5s cubic-bezier(.2,.7,.2,1); }
.card.flipped .card-inner{ transform:rotateY(180deg); }
.card-face{ position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden;
  background:var(--surface); border:1px solid var(--line); border-radius:16px;
  box-shadow:0 10px 30px rgba(21,33,43,.07); padding:30px 28px;
  display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; }
.card-back{ transform:rotateY(180deg); }
.card-tab{ position:absolute; top:16px; left:16px; color:#fff; font-size:11.5px; font-weight:600;
  padding:4px 10px; border-radius:7px; }
.badge{ position:absolute; top:16px; right:16px; font-size:11px; font-weight:700; padding:4px 9px; border-radius:7px; }
.badge.known{ background:rgba(21,128,61,.12); color:var(--green); }
.badge.learning{ background:rgba(180,83,9,.12); color:var(--amber); }
.word{ font-family:'Fraunces',serif; font-weight:600; font-size:clamp(26px,5.5vw,40px);
  letter-spacing:-.01em; padding:0 6px; }
.tap-hint{ position:absolute; bottom:18px; font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--muted); }
.meaning{ font-size:clamp(20px,4.4vw,28px); font-weight:700; margin-bottom:14px; }
.example{ max-width:52ch; }
.ex-en{ font-style:italic; color:var(--ink); font-size:15px; }
.word-small{ position:absolute; bottom:18px; font-family:'JetBrains Mono',monospace; font-size:12.5px; color:var(--muted); }

.study-controls{ display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
.ctrl{ font-family:'Inter'; font-weight:600; font-size:13.5px; padding:12px 6px; border-radius:10px;
  border:1px solid var(--line); background:var(--surface); color:var(--ink); cursor:pointer; }
.ctrl:hover{ border-color:var(--cobalt); }
.ctrl.know{ background:var(--green); color:#fff; border-color:var(--green); }
.ctrl.learn{ background:var(--amber); color:#fff; border-color:var(--amber); }

/* quiz */
.quiz{ background:var(--surface); border:1px solid var(--line); border-radius:16px;
  box-shadow:0 10px 30px rgba(21,33,43,.06); padding:26px 22px; }
.quiz-prompt{ position:relative; padding-top:8px; margin-bottom:22px; text-align:center; }
.quiz-prompt .card-tab{ position:static; display:inline-block; margin-bottom:14px; }
.quiz-label{ color:var(--muted); font-size:13px; margin-bottom:8px; }
.quiz-q{ font-family:'Fraunces',serif; font-weight:600; font-size:clamp(22px,4.6vw,32px); letter-spacing:-.01em; }
.quiz-options{ display:grid; gap:10px; }
.opt{ font-family:'Inter'; font-size:15px; font-weight:500; text-align:left; padding:14px 16px;
  border-radius:11px; border:1px solid var(--line); background:#fff; color:var(--ink); cursor:pointer;
  transition:border-color .12s, background .12s; }
.opt:hover{ border-color:var(--cobalt); background:var(--cobalt-soft); }
.opt.correct{ border-color:var(--green); background:rgba(21,128,61,.10); color:var(--green); font-weight:700; }
.opt.wrong{ border-color:var(--rose); background:rgba(190,24,93,.08); color:var(--rose); }
.opt.dim{ opacity:.5; }
.quiz-foot{ margin-top:18px; text-align:center; }
.quiz-ex{ font-style:italic; color:var(--muted); font-size:14px; margin-bottom:14px; }

/* browse */
.search{ width:100%; font-family:'Inter'; font-size:15px; padding:12px 15px; border-radius:11px;
  border:1px solid var(--line); background:var(--surface); color:var(--ink); margin-bottom:16px; outline:none; }
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
.tagbtn{ font-family:'Inter'; font-size:11.5px; font-weight:600; padding:6px 10px; border-radius:8px;
  border:1px solid var(--line); background:#fff; color:var(--muted); cursor:pointer; white-space:nowrap; }
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
