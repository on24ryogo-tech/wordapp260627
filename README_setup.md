# ルートA：iPhoneホーム画面アプリ化（PWA）手順

既存の Create React App + Vercel 構成にそのまま乗せられます。

## 1. アプリ本体を差し替え
`App_routeA.jsx` の中身を、プロジェクトの `src/App.jsx`（または `src/App.js`）に
そっくり置き換える。`window.storage` は `localStorage` に差し替え済みなので、
ブラウザでそのまま進捗が保存されます。

## 2. アイコンと manifest を配置
`pwa/` の中の4ファイルを、プロジェクトの `public/` フォルダに入れる：

- apple-touch-icon.png  （iPhoneのホーム画面アイコン用 / 180px）
- icon-192.png
- icon-512.png
- manifest.json        （CRAが最初から持っている同名ファイルを上書き）

## 3. public/index.html の <head> に5行を追加
CRAの index.html には既に `<link rel="manifest" ...>` があります。
その近くに、以下を貼り足してください（iOSはこれがないと全画面になりません）：

```html
<meta name="theme-color" content="#2552D9" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Lexicon.Lab" />
<link rel="apple-touch-icon" href="%PUBLIC_URL%/apple-touch-icon.png" />
```

## 4. デプロイ
いつも通り `git push` → Vercelが自動ビルド。
（ローカル確認は `npm start`。）

## 5. iPhoneで「アプリ化」
1. iPhoneの **Safari** で公開URLを開く（Chrome不可。iOSはSafariのみ対応）
2. 下の共有ボタン（□に↑）→ **「ホーム画面に追加」**
3. ホーム画面にフラスコのアイコンが出る → タップすると全画面アプリとして起動

## 注意（iOSのPWAの制約）
- 進捗は端末内 `localStorage` に保存。アプリを消すと進捗も消えます。
- iOS Safariは、7日間まったく開かないと localStorage を消すことがあります
  （日常的に使う分には問題なし）。確実に残したいなら後でクラウド保存に。
- プライベートブラウズでは保存されません。

困ったら「画面が全画面にならない」「アイコンが白い」あたりが定番のつまずき所で、
たいてい手順2・3のどれかが抜けています。
