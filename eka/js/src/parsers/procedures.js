/**
 * Procedures Parser
 * Converts FHIR Procedure resources to EKA EMR procedures format
 */

const {
  generateEkaId,
  getResourcesByType,
  getDisplayFromConcept
} = require('../utils/helpers');

/**
 * Parse procedures from FHIR bundle entries
 * @param {Array} entries - FHIR bundle entries
 * @returns {Array} EKA EMR procedures array
 */
function parseProcedures(entries) {
  const procedures = getResourcesByType(entries, 'Procedure');
  
  // Filter for active/in-progress procedures (not historical ones)
  const currentProcedures = procedures.filter(proc => 
    proc.status !== 'completed'
  );
  
  return currentProcedures.map(proc => {
    const name = getDisplayFromConcept(proc.code) || 'Unknown Procedure';
    
    return {
      id: generateEkaId('p'),
      name
    };
  });
}

module.exports = {
  parseProcedures
};
