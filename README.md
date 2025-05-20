# Koala-template
Koala-Templateの2025版です。rspackを利用しています。


# rspack
本テンプレートは [Rspack](https://rspack.dev/) を使用して構築されています。

## 🖊️

- エントリーポイントは `./src/js/script.js` および `./src/css/style.scss`
- `rsbuild` を利用して設定を簡潔に管理
- `src/img/` からの画像コピーも含めたアセット管理
- `plugin-sass` により SCSS コンパイル対応

## 🛠 ディレクトリ構成概要

```
src/
  js/
    script.js       # JavaScriptのエントリーポイント
  css/
    style.scss      # SCSSのエントリーポイント
  img/              # 画像アセット
public/             # EJSテンプレートHTML
```

## ▶️ 開発サーバ起動方法

```bash
npm install
npm run dev
```

起動後は [http://localhost:1692](http://localhost:1692) で確認できます。

## 📁 src/img フォルダについて

`src/img/` フォルダはビルド時に画像をコピーするために必要ですが、  
中身が空だとビルドエラーになります（glob がマッチしないため）。

画像がまだない場合は、以下のように `.keep` ファイルを入れておいてください：

```bash
touch src/img/.keep
```

# CSS設計方針

本プロジェクトでは、FLOCSSやBEMをベースにしています。

構造の役割を明確に分け、可読性・再利用性・保守性を意識したクラス命名を行います。

---

## 🏷 プレフィックス一覧

| プレフィックス | 用途 | 説明 |
|----------------|------|------|
| 📦 `p-` | プロジェクト | **再利用可能なセクション単位のブロック構造**<br>例：`p-hero`, `p-feature` |
| 🔧 `c-` | コンポーネント | **小規模なUI部品**<br>例：`c-btn`, `c-card`, `c-title` |
| 🧱 `l-` | レイアウト | ページの骨格や構造要素<br>例：`l-page`, `l-header`, `l-footer` |
| 🪶 `u-` | ユーティリティ | 単一機能の補助クラス（1プロパティ単位）<br>例：`u-vh`, `u-df`, `u-t-center` |
| ⚙️ `js-` | JavaScript用 | 制御対象。**スタイル定義はしない**<br>例：`js-accordion`, `js-img`, `js-toggle` |

---

