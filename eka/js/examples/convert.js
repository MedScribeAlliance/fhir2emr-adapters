#!/usr/bin/env node

/**
 * Example script demonstrating EKA EMR Adapter usage
 * 
 * This script:
 * 1. Loads FHIR Bundle from scribe_output.json
 * 2. Converts it to EKA EMR format
 * 3. Saves the output to eka-emr-output.json
 * 4. Displays conversion statistics
 */

const fs = require('fs');
const path = require('path');
const { convertFHIRToEkaEMR } = require('../src/index');

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printHeader() {
  log('\n╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                        ║', 'cyan');
  log('║              EKA EMR ADAPTER - CONVERTER               ║', 'cyan');
  log('║        FHIR Bundle → EKA Care EMR Format               ║', 'cyan');
  log('║                                                        ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');
  log('');
}

function printStats(ekaEMRInput) {
  log('\n📊 Conversion Statistics:', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  
  const stats = [
    { label: 'Symptoms', count: ekaEMRInput.symptoms?.length || 0 },
    { label: 'Diagnoses', count: ekaEMRInput.diagnosis?.length || 0 },
    { label: 'Medications', count: ekaEMRInput.medications?.length || 0 },
    { label: 'Lab Tests Ordered', count: ekaEMRInput.labTests?.length || 0 },
    { label: 'Lab Results', count: ekaEMRInput.labVitals?.length || 0 },
    { label: 'Vitals', count: ekaEMRInput.medicalHistory?.vitals?.length || 0 },
    { label: 'Procedures', count: ekaEMRInput.procedures?.length || 0 },
    { label: 'Medical Conditions', count: ekaEMRInput.medicalHistory?.patientHistory?.patientMedicalConditions?.length || 0 },
    { label: 'Current Medications (History)', count: ekaEMRInput.medicalHistory?.patientHistory?.currentMedications?.length || 0 },
    { label: 'Family History Items', count: ekaEMRInput.medicalHistory?.patientHistory?.familyHistory?.length || 0 },
    { label: 'Lifestyle Habits', count: ekaEMRInput.medicalHistory?.patientHistory?.lifestyleHabits?.length || 0 },
    { label: 'Food/Other Allergies', count: ekaEMRInput.medicalHistory?.patientHistory?.foodOtherAllergy?.length || 0 },
    { label: 'Drug Allergies', count: ekaEMRInput.medicalHistory?.patientHistory?.drugAllergy?.length || 0 },
    { label: 'Past Procedures', count: ekaEMRInput.medicalHistory?.patientHistory?.pastProcedures?.length || 0 },
    { label: 'Travel History', count: ekaEMRInput.medicalHistory?.patientHistory?.recentTravelHistory?.length || 0 },
    { label: 'Examinations', count: ekaEMRInput.medicalHistory?.examinations?.length || 0 }
  ];
  
  let totalItems = 0;
  stats.forEach(stat => {
    if (stat.count > 0) {
      log(`  ✓ ${stat.label.padEnd(30)} : ${stat.count}`, 'green');
      totalItems += stat.count;
    }
  });
  
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log(`  Total Items Converted          : ${totalItems}`, 'bright');
  log('');
}

function printSummary(inputPath, outputPath) {
  log('📁 File Information:', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  
  const inputStats = fs.statSync(inputPath);
  const outputStats = fs.statSync(outputPath);
  
  log(`  Input (FHIR):   ${path.basename(inputPath)} (${(inputStats.size / 1024).toFixed(2)} KB)`, 'cyan');
  log(`  Output (EKA):   ${path.basename(outputPath)} (${(outputStats.size / 1024).toFixed(2)} KB)`, 'cyan');
  log('');
}

async function main() {
  printHeader();
  
  try {
    // Define file paths
    const inputPath = path.join(__dirname, '../../../scribe_output.json');
    const outputPath = path.join(__dirname, '../../../eka-emr-output.json');
    
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      log(`❌ Error: Input file not found at ${inputPath}`, 'red');
      log('   Please ensure scribe_output.json exists in the project root.', 'yellow');
      process.exit(1);
    }
    
    log('🔄 Loading FHIR Bundle...', 'yellow');
    const fhirBundle = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    
    log('✓ FHIR Bundle loaded successfully', 'green');
    log(`  Resource Type: ${fhirBundle.resourceType}`, 'cyan');
    log(`  Bundle Type: ${fhirBundle.type}`, 'cyan');
    log(`  Entry Count: ${fhirBundle.entry?.length || 0}`, 'cyan');
    
    log('\n🔧 Converting to EKA EMR format...', 'yellow');
    const startTime = Date.now();
    
    const ekaEMRInput = convertFHIRToEkaEMR(fhirBundle);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    log(`✓ Conversion completed in ${duration}ms`, 'green');
    
    log('\n💾 Saving output file...', 'yellow');
    fs.writeFileSync(outputPath, JSON.stringify(ekaEMRInput, null, 2), 'utf-8');
    log('✓ Output saved successfully', 'green');
    
    printStats(ekaEMRInput);
    printSummary(inputPath, outputPath);
    
    log('╔════════════════════════════════════════════════════════╗', 'green');
    log('║                                                        ║', 'green');
    log('║            ✅  CONVERSION SUCCESSFUL  ✅                ║', 'green');
    log('║                                                        ║', 'green');
    log('╚════════════════════════════════════════════════════════╝', 'green');
    log('');
    
    log('Next steps:', 'bright');
    log('  1. Review the output in eka-emr-output.json', 'cyan');
    log('  2. Validate the data against EKA Care API schema', 'cyan');
    log('  3. Send to EKA Care EMR API endpoint', 'cyan');
    log('');
    
  } catch (error) {
    log('\n❌ Conversion Failed!', 'red');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'red');
    log(`Error: ${error.message}`, 'red');
    
    if (error.stack) {
      log('\nStack Trace:', 'yellow');
      log(error.stack, 'red');
    }
    
    log('\nTroubleshooting:', 'bright');
    log('  1. Verify scribe_output.json is valid FHIR Bundle', 'cyan');
    log('  2. Check that resourceType is "Bundle"', 'cyan');
    log('  3. Ensure all required FHIR resources are present', 'cyan');
    log('');
    
    process.exit(1);
  }
}

// Run the converter
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
