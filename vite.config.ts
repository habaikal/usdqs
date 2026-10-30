import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'dev-html-fallback',
      apply: 'serve',
      transformIndexHtml(html) {
        // 루트 index.html이 GitHub Pages 루트 배포용(./dist/assets/...)으로 되어 있을 때도
        // 로컬 npm run dev 실행 시에는 자동으로 /src/main.tsx 엔트리를 주입합니다.
        if (html.includes('./dist/assets/')) {
          return html
            .replace(/<script type="module" crossorigin src="\.\/dist\/assets\/[^"]+"><\/script>/g, '')
            .replace(/<link rel="stylesheet" crossorigin href="\.\/dist\/assets\/[^"]+">/g, '')
            .replace('<div id="root"></div>', '<div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>');
        }
        return html;
      },
    },
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
