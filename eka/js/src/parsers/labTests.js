/**
 * Lab Tests Parser
 * Converts FHIR ServiceRequest resources to EKA EMR lab tests format
 */

const {
  generateEkaId,
  getResourcesByType,
  getDisplayFromConcept,
  extractNotes,
  createTrackObject
} = require('../utils/helpers');

/**
 * Parse lab tests from FHIR bundle entries
 * @param {Array} entries - FHIR bundle entries
 * @returns {Array} EKA EMR lab tests array
 */
function parseLabTests(entries) {
  const serviceRequests = getResourcesByType(entries, 'ServiceRequest');
  
  // Filter for lab procedure requests
  const labRequests = serviceRequests.filter(sr => {
    if (!sr.category || !Array.isArray(sr.category)) {
      return false;
    }
    
    return sr.category.some(cat => {
      const display = getDisplayFromConcept(cat);
      return display && display.toLowerCase().includes('laboratory');
    });
  });
  
  return labRequests.map((sr, index) => {
    let testName = 'Unknown Test';
    if (sr.code) {
      if (sr.code.concept) {
        testName = getDisplayFromConcept(sr.code.concept) || testName;
      } else {
        testName = getDisplayFromConcept(sr.code) || testName;
      }
    }
    
    const notes = extractNotes(sr);
    
    return {
      id: generateEkaId('lp'),
      name: testName,
      common_name: testName,
      book: false,
      metadata: {},
      hxng_only: false,
      kind: 'Lab Tests',
      track: createTrackObject(index, 'API_SEARCH'),
      ...(notes && { notes })
    };
  });
}

module.exports = {
  parseLabTests
};
