/**
 * Lab Vitals Parser
 * Converts FHIR Observation resources (category: laboratory) to EKA EMR lab vitals format
 */

const {
  generateEkaId,
  getResourcesByType,
  getDisplayFromConcept,
  parseFHIRDate
} = require('../utils/helpers');

/**
 * Parse lab vitals from FHIR bundle entries
 * @param {Array} entries - FHIR bundle entries
 * @returns {Array} EKA EMR lab vitals array
 */
function parseLabVitals(entries) {
  const observations = getResourcesByType(entries, 'Observation');
  
  const labObs = observations.filter(obs => {
    if (!obs.category || !Array.isArray(obs.category)) {
      return false;
    }
    
    return obs.category.some(cat => {
      const display = getDisplayFromConcept(cat);
      return display && display.toLowerCase().includes('laboratory');
    });
  });
  
  return labObs.map(obs => {
    const name = getDisplayFromConcept(obs.code) || 'Unknown Test';
    
    let value = '';
    let unit = { name: '', id: generateEkaId('lu'), ref_range: {} };
    
    if (obs.valueQuantity) {
      value = obs.valueQuantity.value.toString();
      unit.name = obs.valueQuantity.unit || '';
    } else if (obs.valueString) {
      value = obs.valueString;
    }
    
    // Map interpretation
    let interpretation = null;
    if (obs.interpretation && obs.interpretation.length > 0) {
      const interp = getDisplayFromConcept(obs.interpretation[0]);
      if (interp) {
        interpretation = {
          id: generateEkaId('sm'),
          value: interp,
          eka_id: generateEkaId('sm'),
          name_list: [interp]
        };
      }
    }
    
    return {
      id: generateEkaId('lb'),
      name,
      unit_dislay_name: name,
      value,
      ...(interpretation && { interpretation }),
      date: parseFHIRDate(obs.effectiveDateTime || obs.issued),
      remark: '',
      unit,
      all_units: [unit],
      is_panel: false,
      entity_id: obs.id || generateEkaId('entity')
    };
  });
}

module.exports = {
  parseLabVitals
};
