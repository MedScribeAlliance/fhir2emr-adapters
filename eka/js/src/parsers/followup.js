/**
 * Followup Parser
 * Extracts follow-up information from FHIR Appointment or CarePlan resources
 */

const {
  getResourcesByType,
  parseFHIRDate
} = require('../utils/helpers');

/**
 * Parse follow-up from FHIR bundle entries
 * @param {Array} entries - FHIR bundle entries
 * @returns {Object} EKA EMR followup object
 */
function parseFollowup(entries) {
  const appointments = getResourcesByType(entries, 'Appointment');
  
  if (appointments.length > 0) {
    const appointment = appointments[0];
    
    let followupDate = null;
    if (appointment.start) {
      followupDate = parseFHIRDate(appointment.start);
    }
    
    return {
      date: followupDate,
      optionId: 'MED_D' // Default to "As per medication duration"
    };
  }
  
  // Check CarePlan for follow-up activity
  const carePlans = getResourcesByType(entries, 'CarePlan');
  
  if (carePlans.length > 0) {
    const carePlan = carePlans[0];
    
    if (carePlan.period && carePlan.period.end) {
      return {
        date: parseFHIRDate(carePlan.period.end),
        optionId: 'MED_D'
      };
    }
  }
  
  return {};
}

module.exports = {
  parseFollowup
};
