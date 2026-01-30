# FHIR to EMR Adapters

Universal adapters to connect standardized FHIR output (created using Scribe2FHIR SDK) to various EMR input formats. 

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Installation](#installation)
- [Usage](#usage)
- [FHIR to EMR Mapping](#fhir-to-emr-mapping)
- [Integration Scenarios](#integration-scenarios)
- [Parser Modules](#parser-modules)
- [Utility Functions](#utility-functions)
- [Module Structure](#module-structure)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Testing](#testing)
- [Customization](#customization)
- [Error Handling & Best Practices](#error-handling--best-practices)
- [Troubleshooting](#troubleshooting)
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)

## Overview

These adapters enable seamless integration between any [medScribe Alliance](https://github.com/medScribeAlliance/) compliant scribe engine and various EMR systems. They transform FHIR Bundle resources into EMR-specific input formats, bridging universal healthcare standards with specialized EMR systems.

**Currently supported EMR systems:**
- [EKA Care](./eka/) - Indian healthcare EMR platform

### Why These Adapters?

- **Universal Compatibility**: Works with any medScribe Alliance compliant scribe engine
- **Standardized Input**: Uses FHIR (Fast Healthcare Interoperability Resources) standard
- **Multi-EMR Support**: Adapters for multiple EMR systems in one repository
- **Modular Design**: Each medical entity has its own parser module
- **Production-Ready**: Comprehensive error handling, logging, and validation
- **Zero Dependencies**: Lightweight with no runtime dependencies
- **Fast**: Converts typical bundles in milliseconds
- **Well-Documented**: Extensive documentation and examples

### Adapter Coverage

Each adapter supports comprehensive FHIR resource conversion:
- ✅ Symptoms and Clinical Observations
- ✅ Diagnoses and Conditions
- ✅ Medications and Prescriptions
- ✅ Lab Tests and Results
- ✅ Vital Signs
- ✅ Medical History (conditions, family history, allergies, procedures)
- ✅ Procedures and Interventions
- ✅ Follow-up and Appointments

## Quick Start

Each EMR adapter is in its own directory:

```bash
# EKA Care adapter
cd eka/js
npm install
npm run build
npm run example
```

See individual adapter directories for specific usage:
- [EKA Care Adapter](./eka/) - Complete documentation and examples

## Architecture

### System Overview

```
╔══════════════════════════════════════════════════════════════════════╗
║                    HEALTHCARE ECOSYSTEM                              ║
╚══════════════════════════════════════════════════════════════════════╝

                         ┌─────────────┐
                         │   Doctor    │
                         │  Patient    │
                         │ Conversation│
                         └──────┬──────┘
                                │ Voice/Text
                                ▼
                    ┌───────────────────────┐
                    │   SCRIBE ENGINE       │
                    │ (medScribe Alliance)  │
                    ├───────────────────────┤
                    │ • Speech Recognition  │
                    │ • NLP Processing      │
                    │ • Entity Extraction   │
                    │ • FHIR Generation     │
                    └───────────┬───────────┘
                                │ FHIR R4/R5 Bundle
                                ▼
            ╔═══════════════════════════════════════╗
            ║    FHIR TO EMR ADAPTER (This Repo)    ║
            ╠═══════════════════════════════════════╣
            ║  ┌─────────────────────────────────┐ ║
            ║  │     Main Adapter (index.js)     │ ║
            ║  └──────────────┬──────────────────┘ ║
            ║    ┌────────────┴────────────┐       ║
            ║    ▼                         ▼       ║
            ║  ┌─────────┐           ┌─────────┐  ║
            ║  │ Parsers │           │  Utils  │  ║
            ║  │ • 11 Modules        │ • 9 Fns │  ║
            ║  └─────────┘           └─────────┘  ║
            ╚════════════════╦══════════════════════╝
                             │ EMR-Specific Format
                             ▼
                    ┌─────────────────┐
                    │    TARGET EMR   │
                    │  • Records      │
                    │  • Prescriptions│
                    │  • Patient Data │
                    └─────────────────┘
```

### Integration Flow

```
Clinical Voice → Scribe Engine → FHIR Bundle → EMR Adapter → Target EMR
  (Audio)        (AI Processing)   (Standard)    (Converter)    (System)
```

**Compatible Scribe Engines:**
- ✅ Amazon HealthScribe
- ✅ Azure Health Bot
- ✅ Google Cloud Healthcare API  
- ✅ Custom AI Scribes
- ✅ Any FHIR R4/R5 compliant engine

## Key Features

### 1. Modular Parser Architecture (11 Parsers)
- **Symptoms** - Converts observations with severity, duration, laterality
- **Diagnosis** - Extracts diagnoses with ICD-10 codes, clinical status
- **Medications** - Processes prescriptions with dosage, frequency, timing
- **Medical History** - Comprehensive history (conditions, family, allergies)
- **Vitals** - Blood pressure, pulse, temperature, etc.
- **Lab Tests** - Test orders
- **Lab Results** - Test results with interpretations
- **Procedures** - Medical procedures
- **Injections** - Injection records
- **Follow-up** - Appointment scheduling
- **Notes** - Clinical notes and instructions

### 2. FHIR Support (12+ Resource Types)
Handles Observation, Condition, MedicationRequest, MedicationStatement, ServiceRequest, Procedure, FamilyMemberHistory, AllergyIntolerance, Appointment, and more.

### 3. Utility Functions (9 Helpers)
ID generation, resource filtering, duration calculation, severity mapping, note extraction, and more.

### 4. Production Features
- Zero runtime dependencies
- Comprehensive error handling
- Fast (2ms for sample data)
- Extensive documentation
- MIT Licensed

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd fhir2emr-adapters

# Choose your EMR adapter
cd eka/js
npm install

# Build and test
npm run build
npm run example
```

### As NPM Module

Each adapter can be installed separately:
```bash
npm install eka-emr-adapter
```

## Usage

Each adapter has its own API and usage patterns. See the adapter-specific documentation:

### EKA Care Adapter

```javascript
const { convertFHIRToEkaEMR } = require('eka-emr-adapter');

// Load FHIR Bundle from any medScribe Alliance compliant engine
const fhirBundle = require('./scribe_output.json');

// Convert to EKA Care format
const ekaInput = convertFHIRToEkaEMR(fhirBundle);

// Use with EKA Care API
console.log('✅ Conversion completed!');
```

For complete API reference and examples, see:
- [EKA Care Adapter Documentation](./eka/README.md)
- [EKA Care Usage Guide](./eka/USAGE.md)
- [Build & Browser Support](./eka/js/BUILD.md)

## FHIR to EMR Mapping

### Resource Mapping Overview

Each adapter maps FHIR resources to EMR-specific formats. Example (EKA Care):

| FHIR Resource | Target EMR Section | Description |
|---------------|-----------------|-------------|
| `Observation` (symptom) | `symptoms[]` | Patient symptoms |
| `Condition` (encounter-diagnosis) | `diagnosis[]` | Current diagnoses |
| `Condition` (problem-list-item) | `medicalHistory.patientMedicalConditions[]` | Historical conditions |
| `MedicationRequest` | `medications[]` | Prescribed medications |
| `MedicationStatement` | `medicalHistory.currentMedications[]` | Current medications |
| `Observation` (vital-signs) | `medicalHistory.vitals[]` | Vital signs |
| `Observation` (laboratory) | `labVitals[]` | Lab test results |
| `ServiceRequest` (laboratory) | `labTests[]` | Lab test orders |
| `Procedure` | `procedures[]` | Medical procedures |
| `FamilyMemberHistory` | `medicalHistory.familyHistory[]` | Family medical history |
| `AllergyIntolerance` (food) | `medicalHistory.foodOtherAllergy[]` | Food allergies |
| `AllergyIntolerance` (medication) | `medicalHistory.drugAllergy[]` | Drug allergies |
| `Observation` (social-history) | `medicalHistory.lifestyleHabits[]` | Lifestyle habits |
| `Observation` (exam) | `medicalHistory.examinations[]` | Physical examinations |
| `Appointment` | `followup{}` | Follow-up appointments |

### Example Mappings (EKA Care)

For detailed mappings for each EMR, see the adapter-specific documentation.

**Symptom Example:**
```javascript
// FHIR Input (Universal)
{
  "resourceType": "Observation",
  "category": [{"coding": [{"code": "symptom"}]}],
  "code": {"text": "Headache"},
  "effectiveDateTime": "2026-01-26T18:00:42Z",
  "component": [{
    "code": {"coding": [{"code": "246112005", "display": "Severity"}]},
    "valueCodeableConcept": {"text": "Moderate"}
  }]
}

// EKA Output
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
    }
  }
}
```

**Medication Example:**
```javascript
// FHIR Input (Universal)
{
  "resourceType": "MedicationRequest",
  "medication": {"concept": {"text": "Dolo 650 Tablet"}},
  "dosageInstruction": [{
    "timing": {"repeat": {"frequency": 3, "period": 1, "periodUnit": "d", "when": ["PC"]}},
    "doseAndRate": [{"doseQuantity": {"value": 1, "unit": "tablet"}}]
  }]
}

// EMR Output (EKA Care format)
{
  "id": "b-4117370658",
  "name": "Dolo 650 Tablet",
  "dose": {"value": "1", "unit": "tablet"},
  "frequency": {"custom": "3 times per d"},
  "timing": "After Meal",
  "duration": {"value": "7", "unit": "Days"}
}
```

## Parser Modules

Each parser follows a consistent pattern:

```
Input: FHIR Bundle Entries
  │
  ▼
1. Filter Resources → getResourcesByType(entries, 'ResourceType')
2. Filter by Category → Filter by specific category
3. Extract Data → Get name, components, dates
4. Map to EKA Format → Generate IDs, build properties
5. Return Array → Array of EKA-formatted objects
```

### Available Parsers

| Parser | File | Description |
|--------|------|-------------|
| Symptoms | `src/parsers/symptoms.js` | Symptom observations |
| Diagnosis | `src/parsers/diagnosis.js` | Diagnoses and conditions |
| Medications | `src/parsers/medications.js` | Medication prescriptions |
| Medical History | `src/parsers/medicalHistory.js` | Complete patient history |
| Vitals | `src/parsers/vitals.js` | Vital signs |
| Lab Tests | `src/parsers/labTests.js` | Lab test orders |
| Lab Vitals | `src/parsers/labVitals.js` | Lab test results |
| Procedures | `src/parsers/procedures.js` | Medical procedures |
| Injections | `src/parsers/injections.js` | Injection records |
| Follow-up | `src/parsers/followup.js` | Follow-up appointments |
| Notes | `src/parsers/prescriptionNotes.js` | Clinical notes |

## Utility Functions

Located in `src/utils/helpers.js`:

```javascript
const helpers = require('./src/utils/helpers');

// Generate unique EKA ID
const id = helpers.generateEkaId('s'); // → s-1234567890

// Get resources by type
const observations = helpers.getResourcesByType(entries, 'Observation');

// Extract display text from CodeableConcept
const text = helpers.getDisplayFromConcept(codeableConcept);

// Calculate duration from date
const duration = helpers.calculateDuration('2026-01-25T10:00:00Z');
// → { value: "3", unit: "Days" }

// Map FHIR severity to EKA
const severity = helpers.mapSeverity(severityConcept);
// → "Mild" | "Moderate" | "Severe"

// Extract notes/comments
const notes = helpers.extractNotes(resource);

// Create track object
const track = helpers.createTrackObject(0, 'API_SEARCH');
```

## Module Structure

```
eka-emr-adaptar/
├── src/
│   ├── index.js                    # Main entry point
│   ├── parsers/                    # 11 parser modules
│   │   ├── symptoms.js
│   │   ├── diagnosis.js
│   │   ├── medications.js
│   │   ├── medicalHistory.js
│   │   ├── vitals.js
│   │   ├── labTests.js
│   │   ├── labVitals.js
│   │   ├── procedures.js
│   │   ├── injections.js
│   │   ├── followup.js
│   │   └── prescriptionNotes.js
│   └── utils/
│       └── helpers.js              # 9 utility functions
├── examples/
│   └── convert.js                  # Example with statistics
├── scribe_output.json              # Sample FHIR input
├── eka-emr-input.json              # Sample EKA output (reference)
├── eka-emr-output.json             # Generated output (gitignored)
├── package.json
├── LICENSE
└── README.md
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY src/ ./src/
EXPOSE 3000
CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  eka-adapter:
    build: .
    ports:
      - "3000:3000"
    environment:
      - EKA_API_KEY=${EKA_API_KEY}
      - EKA_API_URL=${EKA_API_URL}
    restart: unless-stopped
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: eka-adapter
spec:
  replicas: 3
  selector:
    matchLabels:
      app: eka-adapter
  template:
    spec:
      containers:
      - name: adapter
        image: eka-adapter:latest
        ports:
        - containerPort: 3000
        env:
        - name: EKA_API_KEY
          valueFrom:
            secretKeyRef:
              name: eka-secrets
              key: api-key
```

## Configuration

## Testing

### Unit Testing

```javascript
const { convertFHIRToEkaEMR } = require('eka-emr-adapter');
const assert = require('assert');

describe('EKA EMR Adapter', () => {
  it('should convert FHIR Bundle', () => {
    const fhirBundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [{
        resource: {
          resourceType: 'Observation',
          category: [{ coding: [{ code: 'symptom' }] }],
          code: { text: 'Fever' }
        }
      }]
    };
    
    const result = convertFHIRToEkaEMR(fhirBundle);
    assert.equal(result.symptoms.length, 1);
    assert.equal(result.symptoms[0].name, 'Fever');
  });
});
```

## Customization

### Adding Custom Parsers

Create new parser in `src/parsers/myParser.js`:

```javascript
const { generateEkaId, getResourcesByType } = require('../utils/helpers');

function parseCustomResource(entries) {
  const resources = getResourcesByType(entries, 'CustomResource');
  
  return resources.map((resource, index) => ({
    id: generateEkaId('custom'),
    name: resource.name || 'Unknown',
    // Add your custom mapping
  }));
}

module.exports = { parseCustomResource };
```

Add to `src/index.js`:

```javascript
const { parseCustomResource } = require('./parsers/myParser');

// In convertFHIRToEkaEMR:
ekaEMRInput.customField = parseCustomResource(entries);
```

## Error Handling & Best Practices

### Error Handling

```javascript
function convertWithErrorHandling(fhirBundle) {
  try {
    return convertFHIRToEkaEMR(fhirBundle);
  } catch (error) {
    if (error.message.includes('Invalid FHIR Bundle')) {
      console.error('Invalid bundle:', error.message);
      return null;
    }
    throw error;
  }
}
```

### Best Practices

1. **Validation**: Always validate FHIR Bundle before conversion
2. **Logging**: Log conversions for audit trails
3. **Monitoring**: Track conversion success/failure rates
4. **Versioning**: Version your adapter deployments
5. **Testing**: Test with real scribe outputs before production
6. **Security**: Use HTTPS and API keys for EMR APIs
7. **Rate Limiting**: Implement rate limiting for API calls
8. **Caching**: Cache ICD-10 lookups and mappings
9. **Async Processing**: Use queues for high-volume scenarios
10. **Retry Logic**: Implement exponential backoff for API failures

## Troubleshooting

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Related Links

- [medScribe Alliance GitHub](https://github.com/medScribeAlliance/)
- [FHIR R4 Specification](https://www.hl7.org/fhir/R4/)
- [FHIR R5 Specification](https://www.hl7.org/fhir/R5/)

### EMR Systems
- [EKA Care](https://www.eka.care/) - Indian healthcare EMR platform

---

**Made with ❤️ for better healthcare interoperability**

For questions or issues, open a GitHub issue or check the documentation.

