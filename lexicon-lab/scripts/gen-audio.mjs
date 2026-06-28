// 使い方: node scripts/gen-audio.mjs [--skip-existing]
// 生成先: public/audio/{key}-word.mp3 / -ja.mp3 / -ex.mp3 / -xj.mp3
// 所要時間: ~10-20分（479語 × 最大4ファイル）

import { DATA } from '../src/data/words.js';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/audio');
fs.mkdirSync(OUT_DIR, { recursive: true });

function toKey(str) {
  return str
    .replace(/β/g, 'beta').replace(/α/g, 'alpha').replace(/γ/g, 'gamma')
    .replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '')
    .toLowerCase().slice(0, 80);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function makeTTS(voice) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  return tts;
}

async function speak(tts, text, filename, retries = 2) {
  const fp = path.join(OUT_DIR, filename);
  if (fs.existsSync(fp) && fs.statSync(fp).size > 500) return true;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const { audioStream } = await tts.toStream(text);
      await new Promise((res, rej) => {
        const ws = fs.createWriteStream(fp);
        audioStream.pipe(ws);
        ws.on('finish', res);
        ws.on('error', rej);
      });
      if (fs.statSync(fp).size < 100) throw new Error('empty');
      return true;
    } catch (e) {
      if (attempt < retries) {
        await sleep(1000 * (attempt + 1));
        // reconnect on failure
        try { await tts.setMetadata(tts._voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3); } catch {}
      } else {
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
        return false;
      }
    }
  }
}

async function main() {
  console.log(`生成先: ${OUT_DIR}`);
  let enTTS = await makeTTS('en-US-AriaNeural');
  let jaTTS = await makeTTS('ja-JP-NanamiNeural');

  let ok = 0, fail = 0, skip = 0;

  for (let i = 0; i < DATA.length; i++) {
    const d = DATA[i];
    const k = toKey(d.e);

    const tasks = [
      { tts: enTTS, text: d.e, file: `${k}-word.mp3`, lang: 'en' },
      { tts: jaTTS, text: d.j.split('・')[0].split('；')[0].trim(), file: `${k}-ja.mp3`, lang: 'ja' },
    ];
    if (d.x)  tasks.push({ tts: enTTS, text: d.x,  file: `${k}-ex.mp3`,  lang: 'en' });
    if (d.xj) tasks.push({ tts: jaTTS, text: d.xj, file: `${k}-xj.mp3`,  lang: 'ja' });

    for (const t of tasks) {
      const fp = path.join(OUT_DIR, t.file);
      if (fs.existsSync(fp) && fs.statSync(fp).size > 500) { skip++; continue; }

      const success = await speak(t.tts, t.text, t.file);
      if (success) { ok++; process.stdout.write('.'); }
      else { fail++; process.stdout.write('x'); }
      await sleep(150); // rate limit guard
    }

    if ((i + 1) % 20 === 0) {
      process.stdout.write(` ${i + 1}/${DATA.length} (ok:${ok} fail:${fail} skip:${skip})\n`);
      // refresh connections every 20 words
      enTTS = await makeTTS('en-US-AriaNeural');
      jaTTS = await makeTTS('ja-JP-NanamiNeural');
    }
  }

  console.log(`\n完了: ok=${ok} fail=${fail} skip=${skip}`);
}

main().catch(console.error);
