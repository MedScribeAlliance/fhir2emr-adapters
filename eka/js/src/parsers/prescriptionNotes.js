/**
 * Prescription Notes Parser
 * Extracts clinical notes and instructions from FHIR DocumentReference or Composition
 */

const {
  generateEkaId,
  getResourcesByType,
  getDisplayFromConcept
} = require('../utils/helpers');

/**
 * Parse prescription notes from FHIR bundle entries
 * @param {Array} entries - FHIR bundle entries
 * @returns {Object} EKA EMR prescription notes object
 */
function parsePrescriptionNotes(entries) {
  // Check for DocumentReference
  const docRefs = getResourcesByType(entries, 'DocumentReference');
  
  for (const docRef of docRefs) {
    if (docRef.content && docRef.content.length > 0) {
      const content = docRef.content[0];
      
      if (content.attachment && content.attachment.data) {
        // If there's base64 data, decode it
        try {
          const decoded = Buffer.from(content.attachment.data, 'base64').toString('utf-8');
          return {
            id: generateEkaId('locale'),
            text: `<p>${decoded}</p>`,
            parsedText: decoded
          };
        } catch (e) {
          // Fallback
        }
      }
    }
  }
  
  // Check for Composition
  const compositions = getResourcesByType(entries, 'Composition');
  
  for (const comp of compositions) {
    if (comp.section && comp.section.length > 0) {
      const notesSection = comp.section.find(s => {
        const title = s.title || '';
        return title.toLowerCase().includes('note') || title.toLowerCase().includes('instruction');
      });
      
      if (notesSection && notesSection.text && notesSection.text.div) {
        return {
          id: generateEkaId('locale'),
          text: notesSection.text.div,
          parsedText: notesSection.text.div.replace(/<[^>]*>/g, '') // Strip HTML
        };
      }
    }
  }
  
  // Check Encounter for notes
  const encounters = getResourcesByType(entries, 'Encounter');
  
  if (encounters.length > 0 && encounters[0].reasonReference) {
    // Could extract reason for visit as notes
  }
  
  return {};
}

module.exports = {
  parsePrescriptionNotes
};
