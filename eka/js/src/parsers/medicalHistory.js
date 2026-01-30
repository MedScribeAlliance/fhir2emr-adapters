/**
 * Medical History Parser
 * Converts FHIR Condition, MedicationStatement, FamilyMemberHistory, AllergyIntolerance, 
 * Observation (social history), and Procedure resources to EKA EMR medical history format
 */

const {
  generateEkaId,
  getResourcesByType,
  getDisplayFromConcept,
  getCodeFromConcept,
  extractNotes,
  parseFHIRDate,
  calculateDuration,
  createTrackObject
} = require('../utils/helpers');

/**
 * Parse medical history from FHIR bundle entries
 * @param {Array} entries - FHIR bundle entries
 * @returns {Object} EKA EMR medical history object
 */
function parseMedicalHistory(entries) {
  const medicalHistory = {
    patientHistory: {
      patientMedicalConditions: parsePatientMedicalConditions(entries),
      currentMedications: parseCurrentMedications(entries),
      familyHistory: parseFamilyHistory(entries),
      lifestyleHabits: parseLifestyleHabits(entries),
      foodOtherAllergy: parseFoodOtherAllergies(entries),
      drugAllergy: parseDrugAllergies(entries),
      pastProcedures: parsePastProcedures(entries),
      recentTravelHistory: parseRecentTravelHistory(entries),
      otherMedicalHistory: []
    },
    vitals: [], // Parsed separately in vitals.js
    examinations: parseExaminations(entries)
  };
  
  return medicalHistory;
}

/**
 * Parse patient medical conditions (historical)
 */
function parsePatientMedicalConditions(entries) {
  const conditions = getResourcesByType(entries, 'Condition');
  
  // Filter for problem-list items (historical conditions)
  const historicalConditions = conditions.filter(cond => {
    if (!cond.category || !Array.isArray(cond.category)) {
      return false;
    }
    
    return cond.category.some(cat => {
      const code = getCodeFromConcept(cat);
      const display = getDisplayFromConcept(cat);
      return (code && code.includes('problem-list-item')) || 
             (display && display.toLowerCase().includes('problem'));
    });
  });
  
  return historicalConditions.map(cond => {
    const name = getDisplayFromConcept(cond.code) || 'Unknown Condition';
    const status = cond.clinicalStatus ? getDisplayFromConcept(cond.clinicalStatus) : 'Active';
    const notes = extractNotes(cond);
    
    let since = null;
    if (cond.onsetDateTime) {
      const duration = calculateDuration(cond.onsetDateTime);
      if (duration) {
        since = { custom: `${duration.value} ${duration.unit}` };
      }
    }
    
    return {
      id: generateEkaId('d'),
      name,
      status,
      reportedAt: parseFHIRDate(cond.recordedDate),
      ...(since && { since }),
      ...(notes && { notes })
    };
  });
}

/**
 * Parse current medications (MedicationStatement)
 */
function parseCurrentMedications(entries) {
  const medicationStatements = getResourcesByType(entries, 'MedicationStatement');
  
  return medicationStatements.map(medStmt => {
    let medicationName = 'Unknown Medication';
    if (medStmt.medication) {
      if (medStmt.medication.concept) {
        medicationName = getDisplayFromConcept(medStmt.medication.concept) || medicationName;
      } else if (medStmt.medication.text) {
        medicationName = medStmt.medication.text;
      }
    }
    
    const status = medStmt.status || 'Active';
    const notes = extractNotes(medStmt);
    
    let since = null;
    if (medStmt.effectiveDateTime) {
      const duration = calculateDuration(medStmt.effectiveDateTime);
      if (duration) {
        since = { custom: `${duration.value} ${duration.unit}` };
      }
    }
    
    return {
      id: generateEkaId('b'),
      name: medicationName,
      status: capitalizeFirst(status),
      generic_id: generateEkaId('g'),
      generic_name: medicationName,
      df_id: generateEkaId('df'),
      reportedAt: parseFHIRDate(medStmt.dateAsserted),
      ...(since && { since }),
      dosage_form: 'tablet',
      dose: {
        custom: '1 tablet',
        id: generateEkaId('du'),
        value: '1',
        unit: 'tablet'
      },
      frequency: {
        custom: notes || 'As directed'
      },
      timing: '',
      ...(notes && { notes })
    };
  });
}

/**
 * Parse family history
 */
function parseFamilyHistory(entries) {
  const familyMemberHistories = getResourcesByType(entries, 'FamilyMemberHistory');
  
  return familyMemberHistories.map(fmh => {
    const relationship = getDisplayFromConcept(fmh.relationship) || 'Unknown';
    const notes = extractNotes(fmh);
    
    // Get condition name
    let conditionName = 'Unknown Condition';
    if (fmh.condition && fmh.condition.length > 0) {
      conditionName = getDisplayFromConcept(fmh.condition[0].code) || conditionName;
    }
    
    return {
      id: generateEkaId('d'),
      name: conditionName,
      status: fmh.status === 'completed' ? 'Active' : 'Unknown',
      reportedAt: parseFHIRDate(fmh.date),
      who: capitalizeFirst(relationship),
      ...(notes && { notes })
    };
  });
}

/**
 * Parse lifestyle habits from social history observations
 */
function parseLifestyleHabits(entries) {
  const observations = getResourcesByType(entries, 'Observation');
  
  const socialHistoryObs = observations.filter(obs => {
    if (!obs.category || !Array.isArray(obs.category)) {
      return false;
    }
    
    return obs.category.some(cat => {
      const display = getDisplayFromConcept(cat);
      return display && display.toLowerCase().includes('social');
    });
  });
  
  return socialHistoryObs.map(obs => {
    const name = getDisplayFromConcept(obs.code) || 'Unknown Habit';
    const status = obs.valueString || 'Active';
    const notes = extractNotes(obs);
    
    let since = null;
    if (obs.effectiveDateTime) {
      const duration = calculateDuration(obs.effectiveDateTime);
      if (duration) {
        since = { custom: `${duration.value} ${duration.unit}` };
      }
    }
    
    return {
      id: generateEkaId('locale'),
      name,
      status,
      reportedAt: parseFHIRDate(obs.issued),
      ...(since && { since }),
      frequency: {
        custom: status
      },
      ...(notes && { notes })
    };
  });
}

/**
 * Parse food and other allergies
 */
function parseFoodOtherAllergies(entries) {
  const allergies = getResourcesByType(entries, 'AllergyIntolerance');
  
  // Filter for food and environmental allergies
  const foodAllergies = allergies.filter(allergy => {
    if (!allergy.category || !Array.isArray(allergy.category)) {
      return true;
    }
    return allergy.category.some(cat => cat === 'food' || cat === 'environment');
  });
  
  return foodAllergies.map(allergy => {
    const name = getDisplayFromConcept(allergy.code) || 'Unknown Allergy';
    const status = allergy.clinicalStatus ? getDisplayFromConcept(allergy.clinicalStatus) : 'Active';
    const notes = extractNotes(allergy);
    
    let since = null;
    if (allergy.onsetDateTime) {
      const duration = calculateDuration(allergy.onsetDateTime);
      if (duration) {
        since = { custom: `${duration.value} ${duration.unit}` };
      }
    }
    
    return {
      id: generateEkaId('a'),
      name,
      status: capitalizeFirst(status),
      reportedAt: parseFHIRDate(allergy.recordedDate),
      ...(since && { since }),
      ...(notes && { notes })
    };
  });
}

/**
 * Parse drug allergies
 */
function parseDrugAllergies(entries) {
  const allergies = getResourcesByType(entries, 'AllergyIntolerance');
  
  // Filter for medication allergies
  const drugAllergies = allergies.filter(allergy => {
    if (!allergy.category || !Array.isArray(allergy.category)) {
      return false;
    }
    return allergy.category.some(cat => cat === 'medication');
  });
  
  return drugAllergies.map(allergy => {
    const name = getDisplayFromConcept(allergy.code) || 'Unknown Drug';
    const status = allergy.clinicalStatus ? getDisplayFromConcept(allergy.clinicalStatus) : 'Active';
    const notes = extractNotes(allergy);
    
    let since = null;
    if (allergy.onsetDateTime) {
      const duration = calculateDuration(allergy.onsetDateTime);
      if (duration) {
        since = { custom: `${duration.value} ${duration.unit}` };
      }
    }
    
    return {
      id: generateEkaId('b'),
      name,
      status: capitalizeFirst(status),
      generic_id: generateEkaId('g'),
      generic_name: name,
      reportedAt: parseFHIRDate(allergy.recordedDate),
      ...(since && { since }),
      ...(notes && { notes })
    };
  });
}

/**
 * Parse past procedures
 */
function parsePastProcedures(entries) {
  const procedures = getResourcesByType(entries, 'Procedure');
  
  // Filter for completed procedures
  const pastProcedures = procedures.filter(proc => 
    proc.status === 'completed'
  );
  
  return pastProcedures.map(proc => {
    const name = getDisplayFromConcept(proc.code) || 'Unknown Procedure';
    const notes = extractNotes(proc);
    
    // Extract date
    let on = null;
    if (proc.performedDateTime) {
      const date = new Date(proc.performedDateTime);
      on = {
        yyyy: date.getFullYear().toString(),
        mm: (date.getMonth() + 1).toString().padStart(2, '0')
      };
    } else if (proc.performedPeriod && proc.performedPeriod.start) {
      const date = new Date(proc.performedPeriod.start);
      on = {
        yyyy: date.getFullYear().toString(),
        mm: (date.getMonth() + 1).toString().padStart(2, '0')
      };
    }
    
    return {
      id: generateEkaId('p'),
      name,
      status: 'Active',
      reportedAt: parseFHIRDate(proc.performedDateTime),
      ...(on && { on }),
      ...(notes && { notes })
    };
  });
}

/**
 * Parse recent travel history from social history observations
 */
function parseRecentTravelHistory(entries) {
  const observations = getResourcesByType(entries, 'Observation');
  
  const travelObs = observations.filter(obs => {
    const code = getDisplayFromConcept(obs.code);
    return code && (code.toLowerCase().includes('travel') || code.toLowerCase().includes('trip'));
  });
  
  return travelObs.map(obs => {
    const name = getDisplayFromConcept(obs.code) || 'Travel History';
    const notes = extractNotes(obs);
    
    return {
      id: generateEkaId('locale-recentTravelHistory'),
      name,
      notes: notes || obs.valueString || '',
      status: '',
      reportedAt: parseFHIRDate(obs.issued)
    };
  });
}

/**
 * Parse examinations
 */
function parseExaminations(entries) {
  const observations = getResourcesByType(entries, 'Observation');
  
  const examObs = observations.filter(obs => {
    if (!obs.category || !Array.isArray(obs.category)) {
      return false;
    }
    
    return obs.category.some(cat => {
      const display = getDisplayFromConcept(cat);
      return display && display.toLowerCase().includes('exam');
    });
  });
  
  return examObs.map(obs => {
    const name = getDisplayFromConcept(obs.code) || 'Unknown Examination';
    
    return {
      id: generateEkaId('s'),
      name,
      common_name: name
    };
  });
}

/**
 * Capitalize first letter of string
 */
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = {
  parseMedicalHistory
};
