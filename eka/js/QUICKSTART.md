# Quick Start Guide

## Installation

```bash
npm install eka-emr-adapter
```

## Usage Examples

### Node.js

```javascript
const { convertFHIRToEkaEMR } = require('eka-emr-adapter');

// Your FHIR Bundle
const fhirBundle = {
  resourceType: 'Bundle',
  type: 'collection',
  entry: [ /* ... */ ]
};

// Convert to EKA EMR format
const ekaEMR = convertFHIRToEkaEMR(fhirBundle);
console.log(ekaEMR);
```

### Browser (CDN)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/eka-emr-adapter"></script>
</head>
<body>
  <script>
    const fhirBundle = { /* ... */ };
    const ekaEMR = EkaEMRAdapter.convertFHIRToEkaEMR(fhirBundle);
    console.log(ekaEMR);
  </script>
</body>
</html>
```

### Browser (Local)

```html
<script src="node_modules/eka-emr-adapter/dist/index.browser.min.js"></script>
<script>
  const ekaEMR = EkaEMRAdapter.convertFHIRToEkaEMR(fhirBundle);
</script>
```

## API

### `convertFHIRToEkaEMR(fhirBundle)`

Converts a FHIR Bundle to EKA Care EMR format.

**Parameters:**
- `fhirBundle` (Object): A FHIR Bundle resource following the medScribe Alliance protocol

**Returns:**
- (Object): EKA EMR formatted data structure

**Throws:**
- Error if the input is not a valid FHIR Bundle

### `convertFHIRToEkaEMRAsync(fhirBundle)`

Async version of the converter (useful for file operations).

**Parameters:**
- `fhirBundle` (Object): A FHIR Bundle resource

**Returns:**
- Promise<Object>: EKA EMR formatted data structure

## Build from Source

```bash
# Clone the repository
git clone https://github.com/medScribeAlliance/eka-emr-adapter.git
cd eka-emr-adapter/eka/js

# Install dependencies
npm install

# Build
npm run build

# Test the build
node examples/test-build.js
```

## Examples

See the `examples/` directory for:
- `convert.js` - Node.js conversion example
- `browser-example.html` - Interactive browser example
- `test-build.js` - Build verification test

## Documentation

- [BUILD.md](BUILD.md) - Detailed build process documentation
- [README.md](../../README.md) - Main project README

## Support

For issues and questions:
- GitHub Issues: https://github.com/medScribeAlliance/eka-emr-adapter/issues
- Documentation: https://github.com/medScribeAlliance/eka-emr-adapter
