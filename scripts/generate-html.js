import fs from 'fs-extra';
import ejs from 'ejs';

const templatePath = './template/index.ejs';
const outputPath   = './public/index.html';
const dataPath     = './public/assets/data.json';

async function generateHTML() {
  const template = await fs.readFile(templatePath, 'utf-8');
  const data = await fs.readJSON(dataPath);

  const html = ejs.render(template, { data });

  await fs.writeFile(outputPath, html, 'utf-8');
  console.log('✅ EJSテンプレートをHTMLに変換しました');
}

generateHTML().catch(console.error);
