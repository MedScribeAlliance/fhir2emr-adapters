/**
 * EKA EMR Adapter - Main Entry Point
 * 
 * This adapter converts FHIR-based scribe output (following medScribe Alliance protocol)
 * to EKA Care EMR input format.
 * 
 * @see https://github.com/medScribeAlliance/
 */

const { parseSymptoms } = require('./parsers/symptoms');
const { parseDiagnosis } = require('./parsers/diagnosis');
const { parseMedications } = require('./parsers/medications');
const { parseMedicalHistory } = require('./parsers/medicalHistory');
const { parseVitals } = require('./parsers/vitals');
const { parseLabTests } = require('./parsers/labTests');
const { parseProcedures } = require('./parsers/procedures');
const { parseInjections } = require('./parsers/injections');
const { parseFollowup } = require('./parsers/followup');
const { parsePrescriptionNotes } = require('./parsers/prescriptionNotes');
const { parseLabVitals } = require('./parsers/labVitals');

/**
 * Main adapter function to convert FHIR Bundle to EKA EMR format
 * 
 * @param {Object} fhirBundle - FHIR Bundle resource from scribe output
 * @returns {Object} EKA EMR formatted input
 */
function convertFHIRToEkaEMR(fhirBundle) {
  if (!fhirBundle || fhirBundle.resourceType !== 'Bundle') {
    throw new Error('Invalid FHIR Bundle: Expected resourceType "Bundle"');
  }

  const entries = fhirBundle.entry || [];
  
  // Initialize EKA EMR output structure
  const ekaEMRInput = {
    allVaccines: [],
    language: 'EN',
    symptoms: [],
    diagnosis: [],
    medications: [],
    injections: [],
    labTests: [],
    followup: {},
    meta: {
      autoCopyStatus: 'REQUIRED'
    },
    prescriptionNotes: {},
    medicalHistory: {
      patientHistory: {
        patientMedicalConditions: [],
        currentMedications: [],
        familyHistory: [],
        lifestyleHabits: [],
        foodOtherAllergy: [],
        drugAllergy: [],
        pastProcedures: [],
        recentTravelHistory: [],
        otherMedicalHistory: []
      },
      vitals: [],
      examinations: []
    },
    labVitals: [],
    administeredVaccines: [],
    procedures: []
  };

  // Parse each section
  ekaEMRInput.symptoms = parseSymptoms(entries);
  ekaEMRInput.diagnosis = parseDiagnosis(entries);
  ekaEMRInput.medications = parseMedications(entries);
  ekaEMRInput.medicalHistory = parseMedicalHistory(entries);
  ekaEMRInput.labTests = parseLabTests(entries);
  ekaEMRInput.labVitals = parseLabVitals(entries);
  ekaEMRInput.procedures = parseProcedures(entries);
  ekaEMRInput.injections = parseInjections(entries);
  ekaEMRInput.followup = parseFollowup(entries);
  ekaEMRInput.prescriptionNotes = parsePrescriptionNotes(entries);

  // Parse vitals from observations
  const vitals = parseVitals(entries);
  ekaEMRInput.medicalHistory.vitals = vitals;

  return ekaEMRInput;
}

/**
 * Async wrapper for the adapter (useful for file operations)
 * 
 * @param {Object} fhirBundle - FHIR Bundle resource
 * @returns {Promise<Object>} EKA EMR formatted input
 */
async function convertFHIRToEkaEMRAsync(fhirBundle) {
  return convertFHIRToEkaEMR(fhirBundle);
}

module.exports = {
  convertFHIRToEkaEMR,
  convertFHIRToEkaEMRAsync
};
