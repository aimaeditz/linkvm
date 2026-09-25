import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function preserveRootBuildPlugin(): Plugin {
  return {
    name: 'preserve-root-build-plugin',
    config() {
      return {
        build: {
          emptyOutDir: false,
        },
      };
    },
    configResolved(config) {
      config.build.emptyOutDir = false;
      if (config.environments) {
        for (const envKey of Object.keys(config.environments)) {
          const env = (config.environments as Record<string, { build?: { emptyOutDir?: boolean } }>)[envKey];
          if (env && env.build) {
            env.build.emptyOutDir = false;
          }
        }
      }
    },
    buildStart() {
      // Safe clean of root: cleans previous build artifacts (assets/, old html/manifest), strictly preserving source code & metadata
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
      // Ensure .nojekyll always exists at repo root
      const rootDir = path.resolve(__dirname, '..');
      const nojekyllPath = path.join(rootDir, '.nojekyll');
      if (!fs.existsSync(nojekyllPath)) {
        fs.writeFileSync(nojekyllPath, '');
      }
    },
    configureServer(server) {
      // Gracefully handle dev navigation to root by routing to /linkvm/
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url === '') {
          res.writeHead(302, { Location: '/linkvm/' });
          res.end();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/linkvm/',
  plugins: [react(), tailwindcss(), preserveRootBuildPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '..',
    emptyOutDir: false,
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
});
