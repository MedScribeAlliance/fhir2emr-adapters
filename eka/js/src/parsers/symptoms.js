/**
 * Symptoms Parser
 * Converts FHIR Observation resources (category: symptom) to EKA EMR symptoms format
 */

const {
  generateEkaId,
  getResourcesByType,
  getDisplayFromConcept,
  extractNotes,
  parseFHIRDate,
  calculateDuration,
  mapSeverity,
  createTrackObject
} = require('../utils/helpers');

/**
 * Parse symptoms from FHIR bundle entries
 * @param {Array} entries - FHIR bundle entries
 * @returns {Array} EKA EMR symptoms array
 */
function parseSymptoms(entries) {
  const observations = getResourcesByType(entries, 'Observation');
  
  // Filter for symptom observations
  const symptomObservations = observations.filter(obs => {
    if (!obs.category || !Array.isArray(obs.category)) {
      return false;
    }
    
    return obs.category.some(cat => {
      const display = getDisplayFromConcept(cat);
      return display && display.toLowerCase().includes('symptom');
    });
  });
  
  return symptomObservations.map((obs, index) => {
    const symptomName = getDisplayFromConcept(obs.code) || 'Unknown Symptom';
    const notes = extractNotes(obs);
    
    // Extract properties from components
    const properties = {};
    
    // Check for severity
    if (obs.component && Array.isArray(obs.component)) {
      const severityComponent = obs.component.find(comp => {
        const code = getDisplayFromConcept(comp.code);
        return code && code.toLowerCase().includes('severity');
      });
      
      if (severityComponent && severityComponent.valueCodeableConcept) {
        const severity = mapSeverity(severityComponent.valueCodeableConcept);
        properties['pg-2869689919'] = {
          name: 'Severity',
          selection: [{
            id: generateEkaId('pr'),
            value: severity
          }]
        };
      }
      
      // Check for laterality
      const lateralityComponent = obs.component.find(comp => {
        const code = getDisplayFromConcept(comp.code);
        return code && code.toLowerCase().includes('laterality');
      });
      
      if (lateralityComponent && lateralityComponent.valueCodeableConcept) {
        const laterality = getDisplayFromConcept(lateralityComponent.valueCodeableConcept);
        if (laterality) {
          properties['pg-laterality'] = {
            name: 'Laterality',
            selection: [{
              id: generateEkaId('pr'),
              value: laterality
            }]
          };
        }
      }
    }
    
    // Calculate duration from effectiveDateTime
    if (obs.effectiveDateTime) {
      const duration = calculateDuration(obs.effectiveDateTime);
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
    
    return {
      id: generateEkaId('s'),
      name: symptomName,
      icd10_code: '', // FHIR might not have ICD-10, would need mapping
      icd10_name: '',
      track: createTrackObject(index, 'API_SEARCH'),
      properties,
      ...(notes && { notes })
    };
  });
}

module.exports = {
  parseSymptoms
};
