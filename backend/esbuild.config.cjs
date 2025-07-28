const esbuild = require('esbuild');
const tsPaths = require('esbuild-ts-paths');

esbuild
  .build({
    entryPoints: ['src/server.ts'],
    bundle: true,
    outdir: 'dist',
    platform: 'node',
    format: 'cjs',
    plugins: [tsPaths('./tsconfig.json')],
  })
  .catch(() => process.exit(1));
