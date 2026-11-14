import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { PUBLIC_ROUTE_SEO, injectSeoIntoHtml } from './src/seo/seoConfig';

function tepRouteSeoPrerenderPlugin(): Plugin {
  let outDir = 'dist';
  return {
    name: 'tep-route-seo-prerender',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir || 'dist';
    },
    closeBundle() {
      const resolvedOutDir = path.resolve(__dirname, outDir);
      const indexHtmlPath = path.join(resolvedOutDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

      for (const [routePath, seo] of Object.entries(PUBLIC_ROUTE_SEO)) {
        const routeHtml = injectSeoIntoHtml(templateHtml, seo);
        if (routePath === '/') {
          fs.writeFileSync(indexHtmlPath, routeHtml, 'utf-8');
        } else {
          const cleanRelative = routePath.replace(/^\/+/, '');
          const targetPath = path.join(resolvedOutDir, `${cleanRelative}.html`);
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.writeFileSync(targetPath, routeHtml, 'utf-8');
        }
      }
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: true,
      },
      plugins: [react(), tepRouteSeoPrerenderPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
