// 共通音声ユーティリティ（Flash / Quiz で使用）

export function toKey(str) {
  return str
    .replace(/β/g, 'beta').replace(/α/g, 'alpha').replace(/γ/g, 'gamma')
    .replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '')
    .toLowerCase().slice(0, 80);
}

export function wordAudioSrc(word) {
  const base = process.env.PUBLIC_URL || '';
  return `${base}/audio/${toKey(word)}-word.mp3`;
}

// 単語1語だけ再生（MP3優先 → TTSフォールバック）。戻り値: stop関数
export function playWord(word, { rate = 1, onDone } = {}) {
  let stopped = false;
  const a = new Audio(wordAudioSrc(word));
  a.playbackRate = rate;

  const tts = () => {
    if (stopped || !window.speechSynthesis) { if (onDone) onDone(); return; }
    const utt = new SpeechSynthesisUtterance(word);
    utt.lang = "en-US";
    utt.rate = 0.88 * rate;
    utt.onend = () => { if (onDone) onDone(); };
    window.speechSynthesis.speak(utt);
  };

  a.onended = () => { if (!stopped && onDone) onDone(); };
  a.onerror = tts;
  a.play().catch(tts);

  return () => {
    stopped = true;
    a.pause();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };
}
