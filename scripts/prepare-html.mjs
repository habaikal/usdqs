import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const rootIndexPath = path.join(rootDir, 'index.html');
const distIndexPath = path.join(rootDir, 'dist', 'index.html');

const DEV_HTML = `<!doctype html>
<html lang="en" class="scroll-smooth dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>USDQS | The Institutional Quantum Stablecoin (USD Quantum Stable)</title>
    <meta name="description" content="USDQS is the premier institutional quantum-grade multi-chain digital dollar. 100% backed by short-term US Treasuries, zero-friction settlement across 16+ blockchains." />
    <!-- Preconnect & Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body style="background-color: #050811; color: #f1f5f9;" class="bg-[#050811] text-slate-100 antialiased selection:bg-emerald-500 selection:text-black overflow-x-hidden">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const mode = process.argv[2] || 'dev';

if (mode === 'dev') {
  fs.writeFileSync(rootIndexPath, DEV_HTML, 'utf8');
  console.log('[prepare-html] Restored source index.html for Vite build.');
} else if (mode === 'prod') {
  if (!fs.existsSync(distIndexPath)) {
    console.error('[prepare-html] dist/index.html not found.');
    process.exit(1);
  }
  const distHtml = fs.readFileSync(distIndexPath, 'utf8');
  // GitHub Pages (main / root 브랜치 배포 모드)에서도 즉시 동작하도록
  // 루트 index.html의 정적 자산 경로를 ./dist/assets/ 로 매핑합니다.
  const rootProdHtml = distHtml
    .replace(/href="\.\/favicon\.svg"/g, 'href="./dist/favicon.svg"')
    .replace(/src="\.\/assets\//g, 'src="./dist/assets/')
    .replace(/href="\.\/assets\//g, 'href="./dist/assets/');

  fs.writeFileSync(rootIndexPath, rootProdHtml, 'utf8');
  console.log('[prepare-html] Synced production index.html to root for GitHub Pages (main / root).');
}
