// Test the CommonJS build
const { convertFHIRToEkaEMR } = require('../dist/index.cjs');

const sampleBundle = {
  resourceType: 'Bundle',
  type: 'collection',
  entry: [
    {
      resource: {
        resourceType: 'Condition',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '38341003',
              display: 'Hypertension'
            }
          ],
          text: 'High Blood Pressure'
        },
        clinicalStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
              code: 'active'
            }
          ]
        }
      }
    }
  ]
};

console.log('Testing EKA EMR Adapter (CommonJS build)...\n');

try {
  const result = convertFHIRToEkaEMR(sampleBundle);
  console.log('✓ Conversion successful!');
  console.log('\nResult:');
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error('✗ Conversion failed:', error.message);
  process.exit(1);
}
