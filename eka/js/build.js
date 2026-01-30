/**
 * Build script for EKA EMR Adapter
 * Creates both Node.js (CommonJS/ESM) and browser (UMD) bundles
 */

const esbuild = require('esbuild');
const { resolve } = require('path');

const buildOptions = {
  entryPoints: [resolve(__dirname, 'src/index.js')],
  bundle: true,
  sourcemap: true,
  target: ['es2015'],
  logLevel: 'info',
};

async function build() {
  try {
    // Build for Node.js (CommonJS)
    await esbuild.build({
      ...buildOptions,
      outfile: resolve(__dirname, 'dist/index.cjs'),
      format: 'cjs',
      platform: 'node',
    });
    console.log('✓ Built CommonJS bundle for Node.js');

    // Build for Node.js (ESM)
    await esbuild.build({
      ...buildOptions,
      outfile: resolve(__dirname, 'dist/index.mjs'),
      format: 'esm',
      platform: 'node',
    });
    console.log('✓ Built ESM bundle for Node.js');

    // Build for browser (IIFE with global variable)
    await esbuild.build({
      ...buildOptions,
      outfile: resolve(__dirname, 'dist/index.browser.js'),
      format: 'iife',
      platform: 'browser',
      globalName: 'EkaEMRAdapter',
      minify: false,
    });
    console.log('✓ Built browser bundle (IIFE)');

    // Build for browser (minified)
    await esbuild.build({
      ...buildOptions,
      outfile: resolve(__dirname, 'dist/index.browser.min.js'),
      format: 'iife',
      platform: 'browser',
      globalName: 'EkaEMRAdapter',
      minify: true,
    });
    console.log('✓ Built minified browser bundle');

    // Build for browser (UMD - works with AMD, CommonJS, and global)
    await esbuild.build({
      ...buildOptions,
      outfile: resolve(__dirname, 'dist/index.umd.js'),
      format: 'cjs',
      platform: 'browser',
      banner: {
        js: `(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EkaEMRAdapter = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {`,
      },
      footer: {
        js: `return module.exports;
}));`,
      },
    });
    console.log('✓ Built UMD bundle for browser');

    console.log('\n✅ All builds completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
