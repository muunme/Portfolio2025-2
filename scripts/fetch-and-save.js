import fs from 'fs';
import fetch from 'node-fetch';

const SHEET_ID   = '10aqe_jPUM3vKOWlrDsX2SmOwgReqmlS2aTdGP7wlSig';
const SHEET_NAME = 'Selected'; 
const API_KEY    = 'AIzaSyAwj7Xw-oaBQhv6bRbKfUN9Znljzy3JVww';
const URL        = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

const outputPath = './public/assets/data.json'; // ← rsbuildは public/ 配下をそのままコピーする
fetch(URL)
  .then((res) => res.json())
  .then((data) => {
    if (!data.values || data.values.length < 2) {
      throw new Error('スプレッドシートに十分なデータがありません');
    }

    const [headers, ...rows] = data.values;
    const formatted = rows.map((row) => {
      const item = {};
      headers.forEach((key, index) => { item[key] = row[index] ?? ''; });
      return item;
    });

    fs.writeFileSync(outputPath, JSON.stringify(formatted, null, 2), 'utf-8');
    console.log('✅ データを保存しました');
  })
  .catch((err) => {
    console.error('❌ エラー:', err.message);
  });