/**
 * Vitals Parser
 * Converts FHIR Observation resources (category: vital-signs) to EKA EMR vitals format
 */

const {
  generateEkaId,
  getResourcesByType,
  getDisplayFromConcept,
  parseFHIRDate
} = require('../utils/helpers');

/**
 * Parse vitals from FHIR bundle entries
 * @param {Array} entries - FHIR bundle entries
 * @returns {Array} EKA EMR vitals array
 */
function parseVitals(entries) {
  const observations = getResourcesByType(entries, 'Observation');
  
  const vitalObs = observations.filter(obs => {
    if (!obs.category || !Array.isArray(obs.category)) {
      return false;
    }
    
    return obs.category.some(cat => {
      const display = getDisplayFromConcept(cat);
      return display && display.toLowerCase().includes('vital');
    });
  });
  
  return vitalObs.map(obs => {
    const name = getDisplayFromConcept(obs.code) || 'Unknown Vital';
    const vitalId = mapVitalNameToId(name);
    
    let value = {
      qt: '',
      unit: '',
      safe: {}
    };
    
    // Extract value
    if (obs.valueQuantity) {
      value.qt = obs.valueQuantity.value.toString();
      value.unit = obs.valueQuantity.unit || '';
      value.code_id = generateEkaId('vu');
    } else if (obs.valueString) {
      value.qt = obs.valueString;
      value.unit = '';
    }
    
    return {
      name,
      dis_name: name,
      id: vitalId,
      value,
      date: parseFHIRDate(obs.effectiveDateTime || obs.issued)
    };
  });
}

/**
 * Map vital name to EKA vital ID
 */
function mapVitalNameToId(name) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('blood pressure') || lowerName.includes('bp')) {
    return 'v-1365277675';
  } else if (lowerName.includes('pulse') || lowerName.includes('heart rate')) {
    return 'lb-1201285132';
  } else if (lowerName.includes('temperature')) {
    return 'v-temperature';
  } else if (lowerName.includes('respiratory') || lowerName.includes('respiration')) {
    return 'v-respiratory';
  } else if (lowerName.includes('oxygen') || lowerName.includes('spo2')) {
    return 'v-oxygen';
  }
  
  return generateEkaId('v');
}

module.exports = {
  parseVitals
};
