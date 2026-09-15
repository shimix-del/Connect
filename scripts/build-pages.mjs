import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const API_DIR = path.join(ROOT, 'src', 'app', 'api');
const TEMP_API_DIR = path.join(ROOT, 'src', 'app', '_api_temp');
const OUT_DIR = path.join(ROOT, 'out');
const NOJEKYLL_FILE = path.join(OUT_DIR, '.nojekyll');

console.log('🚀 Preparing Next.js static build for GitHub Pages...');

let apiMoved = false;

try {
  // 1. Temporarily move API routes so static export doesn't fail on dynamic server handlers
  if (fs.existsSync(API_DIR)) {
    fs.renameSync(API_DIR, TEMP_API_DIR);
    apiMoved = true;
    console.log('📦 Server API routes temporarily isolated for static export.');
  }

  // 2. Run Next.js build with DEPLOY_TARGET=gh-pages
  console.log('⚡ Running Next.js static export build...');
  execSync('npx next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DEPLOY_TARGET: 'gh-pages',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  });

  // 3. Create .nojekyll in ./out to ensure GitHub Pages serves _next files properly
  if (fs.existsSync(OUT_DIR)) {
    fs.writeFileSync(NOJEKYLL_FILE, '', 'utf-8');
    console.log('✅ Created .nojekyll in ./out directory.');
  }

  console.log('🎉 Static export for GitHub Pages completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exitCode = 1;
} finally {
  // 4. Safely restore API routes
  if (apiMoved && fs.existsSync(TEMP_API_DIR)) {
    fs.renameSync(TEMP_API_DIR, API_DIR);
    console.log('🔄 Restored server API routes.');
  }
}
