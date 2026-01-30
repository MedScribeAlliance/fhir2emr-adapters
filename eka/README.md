# EKA Care EMR Adapter

FHIR to EKA Care EMR format adapter - converts standardized FHIR Bundles (from medScribe Alliance compliant engines) to EKA Care's proprietary EMR input format.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [FHIR to EKA Mapping](#fhir-to-eka-mapping)
- [Browser & Node.js Support](#browser--nodejs-support)
- [Integration with EKA Care](#integration-with-eka-care)
- [Examples](#examples)
- [Testing](#testing)

## Overview

This adapter transforms FHIR R4/R5 Bundle resources into EKA Care's EMR input format. It's designed to work with any medScribe Alliance compliant scribe engine output.

### Features

- ✅ **Complete FHIR Support**: Handles 12+ FHIR resource types
- ✅ **Production Ready**: Tested with real clinical data
- ✅ **Fast**: Converts typical bundles in ~2ms
- ✅ **Zero Dependencies**: Lightweight with no runtime dependencies
- ✅ **Universal**: Works in Node.js and browsers
- ✅ **Well Documented**: Comprehensive docs and examples

### Test Results

Successfully tested with sample EKA Care data (22 items converted in 2ms):
- ✅ 2 Symptoms
- ✅ 2 Diagnoses  
- ✅ 1 Medication
- ✅ 2 Lab Tests + 2 Lab Results
- ✅ 1 Vital Sign
- ✅ Complete Medical History (conditions, family history, allergies, procedures)

## Quick Start

```bash
# Navigate to the JavaScript adapter
cd js

# Install dependencies
npm install

# Build for Node.js and browser
npm run build

# Run example conversion
npm run example

# Output will be saved to eka-emr-output.json
```

## Installation

### NPM Package

```bash
npm install eka-emr-adapter
```

### From Source

```bash
cd eka/js
npm install
npm run build
```

## Usage

### Node.js (CommonJS)

```javascript
const { convertFHIRToEkaEMR } = require('eka-emr-adapter');
const fs = require('fs');

// Load FHIR Bundle
const fhirBundle = JSON.parse(fs.readFileSync('scribe_output.json', 'utf-8'));

// Convert to EKA Care format
const ekaEMRInput = convertFHIRToEkaEMR(fhirBundle);

// Save or send to EKA Care API
fs.writeFileSync('eka-emr-input.json', JSON.stringify(ekaEMRInput, null, 2));
console.log('✅ Conversion completed!');
```

### Node.js (ES Modules)

```javascript
import { convertFHIRToEkaEMR } from 'eka-emr-adapter';
import { readFileSync, writeFileSync } from 'fs';

const fhirBundle = JSON.parse(readFileSync('scribe_output.json', 'utf-8'));
const ekaEMRInput = convertFHIRToEkaEMR(fhirBundle);
writeFileSync('eka-emr-input.json', JSON.stringify(ekaEMRInput, null, 2));
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
    const fhirBundle = { /* your FHIR Bundle */ };
    const ekaInput = EkaEMRAdapter.convertFHIRToEkaEMR(fhirBundle);
    console.log(ekaInput);
  </script>
</body>
</html>
```

### Async Usage

```javascript
const { convertFHIRToEkaEMRAsync } = require('eka-emr-adapter');

async function processBundle(fhirBundle) {
  const ekaInput = await convertFHIRToEkaEMRAsync(fhirBundle);
  await sendToEkaCareAPI(ekaInput);
  console.log('✅ Synced to EKA Care');
}
```

## API Reference

### `convertFHIRToEkaEMR(fhirBundle)`

Converts FHIR Bundle to EKA Care EMR format (synchronous).

**Parameters:**
- `fhirBundle` (Object): A FHIR Bundle resource with `resourceType: "Bundle"`

**Returns:**
- (Object): EKA Care EMR formatted input

**Throws:**
- Error if the input is not a valid FHIR Bundle

**Example:**
```javascript
const ekaInput = convertFHIRToEkaEMR(fhirBundle);
```

### `convertFHIRToEkaEMRAsync(fhirBundle)`

Async version of the converter (useful for file operations).

**Parameters:**
- `fhirBundle` (Object): A FHIR Bundle resource

**Returns:**
- Promise<Object>: EKA Care EMR formatted input

**Example:**
```javascript
const ekaInput = await convertFHIRToEkaEMRAsync(fhirBundle);
```

## FHIR to EKA Mapping

### Resource Mapping Table

| FHIR Resource | EKA EMR Section | EKA Field Path | Description |
|---------------|-----------------|----------------|-------------|
| `Observation` (symptom) | `symptoms[]` | Root level | Patient-reported symptoms |
| `Condition` (encounter-diagnosis) | `diagnosis[]` | Root level | Current diagnoses |
| `Condition` (problem-list-item) | `medicalHistory` | `.patientMedicalConditions[]` | Historical conditions |
| `MedicationRequest` | `medications[]` | Root level | New prescriptions |
| `MedicationStatement` | `medicalHistory` | `.currentMedications[]` | Ongoing medications |
| `Observation` (vital-signs) | `medicalHistory` | `.vitals[]` | Vital signs measurements |
| `Observation` (laboratory) | `labVitals[]` | Root level | Lab test results |
| `ServiceRequest` (laboratory) | `labTests[]` | Root level | Lab test orders |
| `Procedure` | `procedures[]` | Root level | Medical procedures |
| `FamilyMemberHistory` | `medicalHistory` | `.familyHistory[]` | Family medical history |
| `AllergyIntolerance` (food) | `medicalHistory` | `.foodOtherAllergy[]` | Food/environmental allergies |
| `AllergyIntolerance` (medication) | `medicalHistory` | `.drugAllergy[]` | Drug allergies |
| `Observation` (social-history) | `medicalHistory` | `.lifestyleHabits[]` | Smoking, alcohol, etc. |
| `Observation` (exam) | `medicalHistory` | `.examinations[]` | Physical examinations |
| `Appointment` | `followup{}` | Root level | Follow-up scheduling |
| `DocumentReference` | `prescriptionNotes{}` | Root level | Clinical notes |

### Detailed Mapping Examples

#### Symptom Mapping

**FHIR Input:**
```json
{
  "resourceType": "Observation",
  "category": [{"coding": [{"code": "symptom"}]}],
  "code": {"text": "Headache"},
  "effectiveDateTime": "2026-01-26T18:00:42Z",
  "component": [
    {
      "code": {"coding": [{"code": "246112005", "display": "Severity"}]},
      "valueCodeableConcept": {"text": "Moderate"}
    },
    {
      "code": {"coding": [{"code": "272741003", "display": "Laterality"}]},
      "valueCodeableConcept": {"text": "Left"}
    }
  ]
}
```

**EKA Output:**
```json
{
  "id": "s-5958917470",
  "name": "Headache",
  "properties": {
    "pg-1541659976": {
      "name": "Since",
      "selection": [{"value": "2", "unit": "Days"}]
    },
    "pg-2869689919": {
      "name": "Severity",
      "selection": [{"value": "Moderate"}]
    },
    "pg-3456789012": {
      "name": "Side",
      "selection": [{"value": "Left"}]
    }
  },
  "track": {
    "index": 0,
    "source": "API_SEARCH",
    "label": "AS_SEARCH"
  }
}
```

#### Diagnosis Mapping

**FHIR Input:**
```json
{
  "resourceType": "Condition",
  "category": [{"coding": [{"code": "encounter-diagnosis"}]}],
  "code": {
    "coding": [
      {
        "system": "http://hl7.org/fhir/sid/icd-10",
        "code": "I10",
        "display": "Essential (primary) hypertension"
      }
    ],
    "text": "Hypertension"
  },
  "clinicalStatus": {
    "coding": [{"code": "active"}]
  }
}
```

**EKA Output:**
```json
{
  "id": "d-6732275838",
  "name": "Hypertension",
  "icd10_code": "I10",
  "icd10_name": "Essential (primary) hypertension",
  "track": {
    "index": 0,
    "source": "API_SEARCH",
    "label": "AS_SEARCH"
  },
  "properties": {}
}
```

#### Medication Mapping

**FHIR Input:**
```json
{
  "resourceType": "MedicationRequest",
  "medication": {"concept": {"text": "Dolo 650 Tablet"}},
  "dosageInstruction": [{
    "timing": {
      "repeat": {
        "frequency": 3,
        "period": 1,
        "periodUnit": "d",
        "when": ["PC"]
      }
    },
    "doseAndRate": [{
      "doseQuantity": {"value": 1, "unit": "tablet"}
    }],
    "text": "Take with plenty of water"
  }],
  "dispenseRequest": {
    "quantity": {"value": 21, "unit": "tablet"},
    "expectedSupplyDuration": {"value": 7, "unit": "d"}
  }
}
```

**EKA Output:**
```json
{
  "id": "b-4117370658",
  "name": "Dolo 650 Tablet",
  "dose": {
    "value": "1",
    "unit": "tablet"
  },
  "frequency": {
    "custom": "3 times per d"
  },
  "timing": "After Meal",
  "duration": {
    "value": "7",
    "unit": "Days"
  },
  "notes": "Take with plenty of water",
  "track": {
    "index": 0,
    "source": "API_SEARCH",
    "label": "AS_SEARCH"
  }
}
```

## Browser & Node.js Support

The adapter works seamlessly in both Node.js and browser environments.

### Build Files

After running `npm run build`, the following files are available in `js/dist/`:

- **`index.cjs`** - CommonJS for Node.js (40 KB)
- **`index.mjs`** - ES Module for Node.js (41 KB)
- **`index.browser.js`** - Browser IIFE unminified (43 KB)
- **`index.browser.min.js`** - Browser IIFE minified (17 KB) ⭐ **Use this for production**
- **`index.umd.js`** - UMD format (41 KB)

### Browser Usage

**Production (Recommended):**
```html
<script src="dist/index.browser.min.js"></script>
<script>
  const result = EkaEMRAdapter.convertFHIRToEkaEMR(fhirBundle);
</script>
```

**Development:**
```html
<script src="dist/index.browser.js"></script>
```

See [js/BUILD.md](./js/BUILD.md) for complete build documentation.

## Integration with EKA Care

### Using EKA Care API

```javascript
const { convertFHIRToEkaEMR } = require('eka-emr-adapter');
const axios = require('axios');

async function syncToEkaCare(fhirBundle) {
  // Convert FHIR to EKA format
  const ekaInput = convertFHIRToEkaEMR(fhirBundle);
  
  // Send to EKA Care API
  const response = await axios.post('https://api.eka.care/emr/import', ekaInput, {
    headers: {
      'Authorization': `Bearer ${process.env.EKA_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('✅ Synced to EKA Care:', response.data);
  return response.data;
}
```

### EKA Care API Endpoints

See [push-by-api.md](./push-by-api.md) for detailed API documentation.

## Examples

### Complete Conversion Example

```javascript
const { convertFHIRToEkaEMR } = require('eka-emr-adapter');

const fhirBundle = {
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Condition",
        "code": {
          "coding": [{
            "system": "http://hl7.org/fhir/sid/icd-10",
            "code": "J00",
            "display": "Acute nasopharyngitis [common cold]"
          }],
          "text": "Common Cold"
        },
        "category": [{
          "coding": [{"code": "encounter-diagnosis"}]
        }],
        "clinicalStatus": {
          "coding": [{"code": "active"}]
        }
      }
    },
    {
      "resource": {
        "resourceType": "MedicationRequest",
        "medication": {
          "concept": {"text": "Paracetamol 500mg"}
        },
        "dosageInstruction": [{
          "timing": {
            "repeat": {"frequency": 3, "period": 1, "periodUnit": "d"}
          },
          "doseAndRate": [{
            "doseQuantity": {"value": 1, "unit": "tablet"}
          }]
        }]
      }
    }
  ]
};

// Convert
const ekaInput = convertFHIRToEkaEMR(fhirBundle);

console.log(JSON.stringify(ekaInput, null, 2));
```

### More Examples

- [js/examples/convert.js](./js/examples/convert.js) - Node.js conversion
- [js/examples/browser-example.html](./js/examples/browser-example.html) - Interactive browser demo
- [js/examples/test-build.js](./js/examples/test-build.js) - Build verification

## Testing

```bash
cd js

# Run the example
npm run example

# Test the built files
node examples/test-build.js

# Browser test
open examples/browser-example.html
```

## Related Documentation

- [USAGE.md](./USAGE.md) - Detailed usage guide
- [js/BUILD.md](./js/BUILD.md) - Build process documentation
- [js/QUICKSTART.md](./js/QUICKSTART.md) - Quick reference
- [push-by-api.md](./push-by-api.md) - EKA Care API integration

## Support

For issues specific to EKA Care integration:
- Email: support@eka.care
- Documentation: https://www.eka.care/docs

For adapter issues:
- GitHub Issues: https://github.com/medScribeAlliance/eka-emr-adapter/issues

## License

MIT License - see [../LICENSE](../LICENSE) file for details

---

**Part of the [FHIR to EMR Adapters](../) project**
