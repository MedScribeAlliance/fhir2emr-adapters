/**
 * Utility functions for FHIR to EKA EMR conversion
 */

/**
 * Generate a unique ID for EKA EMR entities
 * @param {string} prefix - ID prefix (e.g., 's', 'd', 'b')
 * @returns {string} Unique ID
 */
function generateEkaId(prefix) {
  const randomNum = Math.floor(Math.random() * 10000000000);
  return `${prefix}-${randomNum}`;
}

/**
 * Extract resource by type from FHIR bundle entries
 * @param {Array} entries - FHIR bundle entries
 * @param {string} resourceType - Type of resource to extract
 * @returns {Array} Filtered resources
 */
function getResourcesByType(entries, resourceType) {
  return entries
    .filter(entry => entry.resource && entry.resource.resourceType === resourceType)
    .map(entry => entry.resource);
}

/**
 * Find coding value from CodeableConcept
 * @param {Object} codeableConcept - FHIR CodeableConcept
 * @param {string} system - System URL (optional)
 * @returns {string|null} Code value
 */
function getCodeFromConcept(codeableConcept, system = null) {
  if (!codeableConcept || !codeableConcept.coding) {
    return null;
  }
  
  const coding = system 
    ? codeableConcept.coding.find(c => c.system === system)
    : codeableConcept.coding[0];
    
  return coding ? coding.code : null;
}

/**
 * Get display text from CodeableConcept
 * @param {Object} codeableConcept - FHIR CodeableConcept
 * @returns {string|null} Display text
 */
function getDisplayFromConcept(codeableConcept) {
  if (!codeableConcept) {
    return null;
  }
  
  if (codeableConcept.text) {
    return codeableConcept.text;
  }
  
  if (codeableConcept.coding && codeableConcept.coding[0]) {
    return codeableConcept.coding[0].display || null;
  }
  
  return null;
}

/**
 * Extract notes/comments from FHIR resource
 * @param {Object} resource - FHIR resource
 * @returns {string|null} Concatenated notes
 */
function extractNotes(resource) {
  if (!resource.note || !Array.isArray(resource.note)) {
    return null;
  }
  
  return resource.note.map(n => n.text).filter(Boolean).join('; ');
}

/**
 * Parse FHIR date/datetime to timestamp
 * @param {string} fhirDate - FHIR date string
 * @returns {string} ISO timestamp
 */
function parseFHIRDate(fhirDate) {
  if (!fhirDate) {
    return new Date().toISOString();
  }
  
  try {
    return new Date(fhirDate).toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
}

/**
 * Calculate duration from onset date
 * @param {string} onsetDate - FHIR date string
 * @returns {Object} Duration object with value and unit
 */
function calculateDuration(onsetDate) {
  if (!onsetDate) {
    return null;
  }
  
  try {
    const onset = new Date(onsetDate);
    const now = new Date();
    const diffMs = now - onset;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      return { value: diffHours.toString(), unit: 'Hours' };
    } else if (diffDays < 30) {
      return { value: diffDays.toString(), unit: 'Days' };
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return { value: diffMonths.toString(), unit: 'Months' };
    } else {
      const diffYears = Math.floor(diffDays / 365);
      return { value: diffYears.toString(), unit: 'Years' };
    }
  } catch (e) {
    return null;
  }
}

/**
 * Map FHIR severity to EKA severity
 * @param {Object} severityConcept - FHIR severity CodeableConcept
 * @returns {string} EKA severity value
 */
function mapSeverity(severityConcept) {
  const severityText = getDisplayFromConcept(severityConcept);
  
  if (!severityText) {
    return 'Moderate';
  }
  
  const lowerSeverity = severityText.toLowerCase();
  
  if (lowerSeverity.includes('mild') || lowerSeverity.includes('low')) {
    return 'Mild';
  } else if (lowerSeverity.includes('severe') || lowerSeverity.includes('high')) {
    return 'Severe';
  } else {
    return 'Moderate';
  }
}

/**
 * Create EKA track object
 * @param {number} index - Index in list
 * @param {string} source - Source type
 * @returns {Object} Track object
 */
function createTrackObject(index = 0, source = 'API_SEARCH') {
  return {
    index,
    source,
    label: 'AS_SEARCH'
  };
}

module.exports = {
  generateEkaId,
  getResourcesByType,
  getCodeFromConcept,
  getDisplayFromConcept,
  extractNotes,
  parseFHIRDate,
  calculateDuration,
  mapSeverity,
  createTrackObject
};
