// Runs after `npm install`.
//
// Why: Windows Smart App Control blocks Next.js's native compiler file
// (next-swc.win32-x64-msvc.node), so `next dev` / `next build` crash on such PCs.
// Next 14 has a WebAssembly copy of the same compiler (@next/swc-wasm-nodejs),
// but it only uses it on platforms it doesn't support natively.
//
// What: adds one line to Next's loader so that, when the native compiler fails
// to load, it falls back to the WebAssembly one. Where the native compiler works
// (e.g. on Vercel) nothing changes.

const fs = require('fs');
const path = require('path');

const MARKER = '/* queless: wasm fallback */';
const ANCHOR = '        logLoadFailure(attempts, true);\n    });';

const file = path.join(path.dirname(require.resolve('next/package.json')), 'dist/build/swc/index.js');
const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

if (src.includes(MARKER)) {
  // already patched
} else if (!src.includes(ANCHOR)) {
  console.warn('[next-wasm-fallback] Next.js loader looks different; skipping patch.');
} else {
  const patch =
    `        ${MARKER}\n` +
    '        { const wasm = await tryLoadWasmWithFallback(attempts); if (wasm) return resolve(wasm); }\n';
  fs.writeFileSync(file, src.replace(ANCHOR, patch + ANCHOR));
  console.log('[next-wasm-fallback] Enabled WebAssembly compiler fallback for Next.js.');
}
