# Build Process

## Overview

The EKA EMR Adapter is built to work in both Node.js and browser environments using [esbuild](https://esbuild.github.io/).

## Building

Run the build command to generate all distribution files:

```bash
npm run build
```

This creates the following files in the `dist/` directory:

### Output Files

- **`index.cjs`** - CommonJS bundle for Node.js (default)
- **`index.mjs`** - ES Module bundle for Node.js
- **`index.browser.js`** - IIFE bundle for browsers (unminified)
- **`index.browser.min.js`** - IIFE bundle for browsers (minified)
- **`index.umd.js`** - UMD bundle (works with AMD, CommonJS, and as a global)
- **`*.map`** - Source maps for all bundles

## Usage

### Node.js (CommonJS)

```javascript
const { convertFHIRToEkaEMR } = require('eka-emr-adapter');

const fhirBundle = { /* your FHIR Bundle */ };
const ekaEMR = convertFHIRToEkaEMR(fhirBundle);
```

### Node.js (ES Modules)

```javascript
import { convertFHIRToEkaEMR } from 'eka-emr-adapter';

const fhirBundle = { /* your FHIR Bundle */ };
const ekaEMR = convertFHIRToEkaEMR(fhirBundle);
```

### Browser (Script Tag)

```html
<!-- Use the minified version for production -->
<script src="node_modules/eka-emr-adapter/dist/index.browser.min.js"></script>

<script>
  const fhirBundle = { /* your FHIR Bundle */ };
  const ekaEMR = EkaEMRAdapter.convertFHIRToEkaEMR(fhirBundle);
  console.log(ekaEMR);
</script>
```

### Browser (CDN)

```html
<!-- Via unpkg -->
<script src="https://unpkg.com/eka-emr-adapter/dist/index.browser.min.js"></script>

<!-- Via jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/eka-emr-adapter/dist/index.browser.min.js"></script>

<script>
  const ekaEMR = EkaEMRAdapter.convertFHIRToEkaEMR(fhirBundle);
</script>
```

### Browser (ES Module)

```html
<script type="module">
  import { convertFHIRToEkaEMR } from './node_modules/eka-emr-adapter/dist/index.mjs';
  
  const fhirBundle = { /* your FHIR Bundle */ };
  const ekaEMR = convertFHIRToEkaEMR(fhirBundle);
</script>
```

### AMD (RequireJS)

```javascript
require(['eka-emr-adapter'], function(EkaEMRAdapter) {
  const fhirBundle = { /* your FHIR Bundle */ };
  const ekaEMR = EkaEMRAdapter.convertFHIRToEkaEMR(fhirBundle);
});
```

## Browser Example

A complete browser example is available in `examples/browser-example.html`. To try it:

1. Build the project: `npm run build`
2. Open `examples/browser-example.html` in your browser
3. The page will load with sample FHIR data
4. Click "Convert to EKA EMR Format" to see the conversion in action

## Package Exports

The package.json uses the `exports` field to provide optimal loading for different environments:

```json
{
  "main": "dist/index.cjs",        // Default (Node.js CommonJS)
  "module": "dist/index.mjs",      // Node.js ES Module
  "browser": "dist/index.browser.js", // Browser build
  "exports": {
    ".": {
      "browser": "./dist/index.browser.js",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "default": "./dist/index.cjs"
    }
  }
}
```

## Build Configuration

The build is configured in `build.js` using esbuild with the following settings:

- **Target**: ES2015 for broad compatibility
- **Bundling**: All dependencies are bundled
- **Source Maps**: Generated for all builds
- **Minification**: Applied to `.min.js` files only

## Development

For development, you can:

1. Make changes to source files in `src/`
2. Run `npm run build` to rebuild
3. Test using the example files or your own integration

## Publishing

The build is automatically run before publishing to npm:

```bash
npm publish
```

The `prepublishOnly` script ensures the latest build is included in the package.

## File Sizes (approximate)

- CommonJS: ~40 KB (unminified)
- ES Module: ~40 KB (unminified)
- Browser IIFE: ~43 KB (unminified)
- Browser IIFE: ~17 KB (minified)
- UMD: ~41 KB (unminified)

All sizes include source maps.
