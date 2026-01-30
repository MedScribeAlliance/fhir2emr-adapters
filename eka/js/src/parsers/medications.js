/**
 * Medications Parser
 * Converts FHIR MedicationRequest resources to EKA EMR medications format
 */

const {
  generateEkaId,
  getResourcesByType,
  getDisplayFromConcept,
  extractNotes,
  createTrackObject
} = require('../utils/helpers');

/**
 * Parse medications from FHIR bundle entries
 * @param {Array} entries - FHIR bundle entries
 * @returns {Array} EKA EMR medications array
 */
function parseMedications(entries) {
  const medicationRequests = getResourcesByType(entries, 'MedicationRequest');
  
  return medicationRequests.map((medReq, index) => {
    // Extract medication name
    let medicationName = 'Unknown Medication';
    if (medReq.medication) {
      if (medReq.medication.concept) {
        medicationName = getDisplayFromConcept(medReq.medication.concept) || medicationName;
      } else if (medReq.medication.text) {
        medicationName = medReq.medication.text;
      }
    }
    
    const notes = extractNotes(medReq);
    
    // Extract dosage information
    let dose = { custom: '1 tablet', value: '1', unit: 'tablet' };
    let frequency = { type: 'custom', custom: 'As directed' };
    let timing = '';
    let duration = { value: '7', unit: 'Days', custom: '7 Days' };
    let dosageText = '';
    
    if (medReq.dosageInstruction && medReq.dosageInstruction.length > 0) {
      const dosageInstruction = medReq.dosageInstruction[0];
      
      // Full text instruction
      if (dosageInstruction.text) {
        dosageText = dosageInstruction.text;
      }
      
      // Dose quantity
      if (dosageInstruction.doseAndRate && dosageInstruction.doseAndRate.length > 0) {
        const doseAndRate = dosageInstruction.doseAndRate[0];
        if (doseAndRate.doseQuantity) {
          const doseQty = doseAndRate.doseQuantity;
          dose = {
            custom: `${doseQty.value} ${doseQty.unit || 'tablet'}`,
            id: generateEkaId('du'),
            value: doseQty.value.toString(),
            unit: doseQty.unit || 'tablet'
          };
        }
      }
      
      // Timing and frequency
      if (dosageInstruction.timing && dosageInstruction.timing.repeat) {
        const repeat = dosageInstruction.timing.repeat;
        
        if (repeat.frequency && repeat.period && repeat.periodUnit) {
          const freqText = `${repeat.frequency} time${repeat.frequency > 1 ? 's' : ''} per ${repeat.periodUnit}`;
          frequency = {
            type: 'custom',
            custom: freqText
          };
        }
        
        // Timing (when to take)
        if (repeat.when && repeat.when.length > 0) {
          const whenCode = repeat.when[0];
          timing = mapWhenToTiming(whenCode);
        }
      }
      
      // Route
      if (dosageInstruction.route) {
        const route = getDisplayFromConcept(dosageInstruction.route);
        // Route information can be added to notes or instructions
      }
    }
    
    // Duration
    if (medReq.dispenseRequest && medReq.dispenseRequest.expectedSupplyDuration) {
      const supplyDuration = medReq.dispenseRequest.expectedSupplyDuration;
      duration = {
        value: supplyDuration.value.toString(),
        unit: mapDurationUnit(supplyDuration.code || supplyDuration.unit),
        custom: `${supplyDuration.value} ${mapDurationUnit(supplyDuration.code || supplyDuration.unit)}`
      };
    }
    
    return {
      id: generateEkaId('b'),
      name: medicationName,
      form: '',
      dosage_form: dose.unit,
      df_id: generateEkaId('df'),
      dose,
      generic_id: generateEkaId('g'),
      generic_name: medicationName, // In real scenario, this would be mapped
      frequency,
      timing,
      duration,
      instruction: dosageText || notes,
      product_type: capitalizeFirst(dose.unit),
      actual_name: null,
      meta: {
        updatedAt: Date.now(),
        isLocal: 0,
        fCount: 1,
        do_not_purge: null
      },
      soa: false,
      is_otc: null,
      manufacturer_name: '',
      manufacturer_id: null,
      med_cat: null,
      meta_info: null,
      kind: 'Medicines',
      track: createTrackObject(index, 'API_SEARCH'),
      product_sku: '',
      dosage: {
        unit: dose.unit,
        unit_name: dose.unit,
        unit_id: dose.id,
        dosage: frequency.custom,
        dosage_form: dose.unit,
        df_id: generateEkaId('df'),
        days: duration.value,
        food: timing ? 'AF' : 'SF' // After Food or Sans Food
      },
      action_class: {},
      common_name: medicationName,
      hxng_mapped: '',
      mapping_status: {
        onemg_mapped: '',
        medpay_mapped: ''
      },
      drug_name_match: true,
      is_cerebro_verified: false,
      include_suggestion: false,
      highlighted_fields: {},
      quantity: {},
      hxng_status: '',
      instructions: dosageText || notes
    };
  });
}

/**
 * Map FHIR 'when' code to EKA timing
 * @param {string} whenCode - FHIR timing code
 * @returns {string} EKA timing
 */
function mapWhenToTiming(whenCode) {
  const timingMap = {
    'PC': 'After Meal',
    'AC': 'Before Meal',
    'C': 'With Meal',
    'CM': 'In the Morning',
    'CV': 'In the Evening',
    'HS': 'At Bedtime'
  };
  
  return timingMap[whenCode] || '';
}

/**
 * Map FHIR duration unit to EKA format
 * @param {string} unit - FHIR unit code
 * @returns {string} EKA duration unit
 */
function mapDurationUnit(unit) {
  const unitMap = {
    'd': 'Days',
    'day': 'Days',
    'wk': 'Weeks',
    'week': 'Weeks',
    'mo': 'Months',
    'month': 'Months',
    'h': 'Hours',
    'hour': 'Hours'
  };
  
  return unitMap[unit] || 'Days';
}

/**
 * Capitalize first letter
 * @param {string} str
 * @returns {string}
 */
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  parseMedications
};
