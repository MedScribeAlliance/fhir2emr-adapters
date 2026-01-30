/**
 * Injections Parser
 * Converts FHIR MedicationAdministration or specific MedicationRequest resources 
 * to EKA EMR injections format
 */

const {
  generateEkaId,
  getResourcesByType,
  getDisplayFromConcept
} = require('../utils/helpers');

/**
 * Parse injections from FHIR bundle entries
 * @param {Array} entries - FHIR bundle entries
 * @returns {Array} EKA EMR injections array
 */
function parseInjections(entries) {
  // Check for MedicationAdministration resources
  const medAdministrations = getResourcesByType(entries, 'MedicationAdministration');
  
  return medAdministrations.map(medAdmin => {
    let medicationName = 'Unknown Injection';
    if (medAdmin.medication) {
      if (medAdmin.medication.concept) {
        medicationName = getDisplayFromConcept(medAdmin.medication.concept) || medicationName;
      } else if (medAdmin.medication.text) {
        medicationName = medAdmin.medication.text;
      }
    }
    
    return {
      id: generateEkaId('inj'),
      name: medicationName,
      status: medAdmin.status || 'completed'
    };
  });
}

module.exports = {
  parseInjections
};
