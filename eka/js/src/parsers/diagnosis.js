/**
 * Diagnosis Parser
 * Converts FHIR Condition resources to EKA EMR diagnosis format
 */

const {
  generateEkaId,
  getResourcesByType,
  getDisplayFromConcept,
  getCodeFromConcept,
  extractNotes,
  calculateDuration,
  mapSeverity,
  createTrackObject
} = require('../utils/helpers');

/**
 * Parse diagnosis from FHIR bundle entries
 * @param {Array} entries - FHIR bundle entries
 * @returns {Array} EKA EMR diagnosis array
 */
function parseDiagnosis(entries) {
  const conditions = getResourcesByType(entries, 'Condition');
  
  // Filter for encounter diagnosis (not historical conditions)
  const diagnosisConditions = conditions.filter(cond => {
    if (!cond.category || !Array.isArray(cond.category)) {
      return true; // Include if no category specified
    }
    
    return cond.category.some(cat => {
      const code = getCodeFromConcept(cat);
      const display = getDisplayFromConcept(cat);
      return (code && code.includes('encounter-diagnosis')) || 
             (display && display.toLowerCase().includes('encounter'));
    });
  });
  
  return diagnosisConditions.map((cond, index) => {
    const diagnosisName = getDisplayFromConcept(cond.code) || 'Unknown Diagnosis';
    const notes = extractNotes(cond);
    
    // Extract ICD-10 code if available
    let icd10Code = '';
    let icd10Name = '';
    
    if (cond.code && cond.code.coding) {
      const icd10Coding = cond.code.coding.find(c => 
        c.system && (c.system.includes('icd-10') || c.system.includes('icd10'))
      );
      
      if (icd10Coding) {
        icd10Code = icd10Coding.code || '';
        icd10Name = icd10Coding.display || diagnosisName;
      }
    }
    
    // Build properties
    const properties = {};
    
    // Calculate duration from onset
    if (cond.onsetDateTime) {
      const duration = calculateDuration(cond.onsetDateTime);
      if (duration) {
        properties['pg-1541659976'] = {
          name: 'Since',
          selection: [{
            id: generateEkaId('pr'),
            value: duration.value,
            unit: duration.unit
          }]
        };
      }
    }
    
    // Map clinical status
    if (cond.clinicalStatus) {
      const clinicalStatus = getDisplayFromConcept(cond.clinicalStatus);
      if (clinicalStatus) {
        properties['pg-002'] = {
          name: 'Current status',
          selection: [{
            id: generateEkaId('pr'),
            value: clinicalStatus
          }]
        };
      }
    }
    
    // Map severity
    if (cond.severity) {
      const severity = mapSeverity(cond.severity);
      properties['pg-severity'] = {
        name: 'Severity',
        selection: [{
          id: generateEkaId('pr'),
          value: severity
        }]
      };
    }
    
    // Map body site
    if (cond.bodySite && Array.isArray(cond.bodySite) && cond.bodySite.length > 0) {
      const bodySite = getDisplayFromConcept(cond.bodySite[0]);
      if (bodySite) {
        properties['pg-bodysite'] = {
          name: 'Body Site',
          selection: [{
            id: generateEkaId('pr'),
            value: bodySite
          }]
        };
      }
    }
    
    return {
      id: generateEkaId('d'),
      name: diagnosisName,
      icd10_code: icd10Code,
      icd10_name: icd10Name,
      track: createTrackObject(index, 'API_SEARCH'),
      properties,
      ...(notes && { notes })
    };
  });
}

module.exports = {
  parseDiagnosis
};
