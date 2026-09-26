import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getComputedBase(mode: string): string {
  if (process.env.AI_STUDIO === 'true' || process.env.AI_STUDIO) {
    return '/';
  }
  if (process.env.VITE_BASE_PATH) {
    return process.env.VITE_BASE_PATH;
  }
  const env = loadEnv(mode, __dirname, '');
  const siteUrl = process.env.VITE_SITE_URL || env.VITE_SITE_URL;
  if (siteUrl) {
    try {
      const parsed = new URL(siteUrl);
      const pathname = parsed.pathname;
      return pathname.endsWith('/') ? pathname : `${pathname}/`;
    } catch {
      // Fallback below
    }
  }
  return '/';
}

function preserveRootBuildPlugin(): Plugin {
  return {
    name: 'preserve-root-build-plugin',
    buildStart() {
      // Safe clean of app-source/dist
      const distDir = path.resolve(__dirname, 'dist');
      if (fs.existsSync(distDir)) {
        try {
          fs.rmSync(distDir, { recursive: true, force: true });
        } catch {
          // ignore
        }
      }

      // Safe clean of root: cleans previous build artifacts (assets/, old html/manifest), strictly preserving source code & metadata & config
      const rootDir = path.resolve(__dirname, '..');
      const preserved = new Set([
        '.git',
        '.github',
        '.gitignore',
        'README.md',
        '.nojekyll',
        'LICENSE',
        'app-source',
        'node_modules',
        'package.json',
        'bun.lock',
        'metadata.json',
        'vercel.json',
        'CNAME',
        '.env',
        '.env.example',
        '.env.production',
      ]);

      if (fs.existsSync(rootDir)) {
        const items = fs.readdirSync(rootDir);
        for (const item of items) {
          if (!preserved.has(item) && !item.startsWith('.')) {
            const itemPath = path.join(rootDir, item);
            try {
              fs.rmSync(itemPath, { recursive: true, force: true });
            } catch {
              // ignore
            }
          }
        }
      }
    },
    closeBundle() {
      // Ensure dist contents are copied to rootDir for Vercel Output Directory '.'
      const rootDir = path.resolve(__dirname, '..');
      const distDir = path.resolve(__dirname, 'dist');
      if (fs.existsSync(distDir)) {
        fs.cpSync(distDir, rootDir, { recursive: true });
      }
      // Ensure .nojekyll always exists at repo root
      const nojekyllPath = path.join(rootDir, '.nojekyll');
      if (!fs.existsSync(nojekyllPath)) {
        fs.writeFileSync(nojekyllPath, '');
      }
    },
    configureServer(server) {
      // Gracefully handle dev navigation to root by routing to configured base
      const base = getComputedBase(process.env.NODE_ENV || 'development');
      if (base !== '/') {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '') {
            res.writeHead(302, { Location: base });
            res.end();
            return;
          }
          next();
        });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const base = getComputedBase(mode);

  return {
    base,
    plugins: [react(), tailwindcss(), preserveRootBuildPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      assetsDir: 'assets',
      sourcemap: false,
      cssMinify: 'esbuild',
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
