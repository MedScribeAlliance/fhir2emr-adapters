# CARE adapter

Converts a MedScribe Alliance FHIR R5 bundle (the [scribe2fhir](https://github.com/MedScribeAlliance/scribe2fhir) output) into the values that [CARE](https://github.com/ohcnetwork/care_fe)'s structured questionnaire questions take. CARE can load them into the encounter form like a response template. The doctor reviews them, and the form saves them through CARE's usual upsert APIs.

The adapter is a pure function with no dependencies. It doesn't fetch, decrypt or save anything.

## Usage

```js
import { convertFHIRToCare } from "care-emr-adapter";

const care = convertFHIRToCare(bundle, { encounter: encounterId });
```

`encounter` is optional. When it's given, it's set on every entry.

## Output

Each key matches a CARE `StructuredQuestionType`. Each value has the shape of CARE's matching request type.

| Key | From | CARE type |
|---|---|---|
| `symptom` | `Observation` with category `symptom` | `SymptomRequest` |
| `diagnosis` | `Condition` (`encounter-diagnosis` is an encounter diagnosis, `problem-list-item` is a chronic condition) | `DiagnosisRequest` |
| `allergy_intolerance` | `AllergyIntolerance` | `AllergyIntoleranceRequest` |
| `medication_request` | `MedicationRequest` | `MedicationRequestCreate` |
| `medication_statement` | `MedicationStatement` | `MedicationStatementRequest` |
| `review` | | entries a doctor must complete before CARE accepts them |
| `unmapped` | everything else except Patient and Encounter | `{ resourceType, id, text }` |

### What needs review

CARE binds codes to value sets (SNOMED for conditions, allergies, medications and routes; UCUM for dose units). A FHIR concept with no coding becomes `{ system: "", code: "", display: text }`. It's listed in `review` with `issue: "uncoded"` so the doctor can pick a code. Dosage fields are listed too (see Dosage).

### Defaults

When the bundle leaves a status out, the adapter uses the same default CARE's form uses for a new entry. Symptoms default to `active`, `confirmed` and `moderate`. Allergies default to `medication` and `low`. Medicine statements default to `information_source: patient`. A medicine's `category` comes from the resource, then from the encounter class (`AMB` means outpatient, `IMP` means inpatient), and otherwise defaults to `inpatient`. Its `priority` defaults to `routine`. Those are the two values CARE's Rx pad sets itself, and its API rejects a medicine without them. A symptom whose finding context is `absent` is `refuted`.

### Dosage

Each dosage maps to every field of a CARE Rx pad row:

- **Frequency:** the frequency, period and period unit pick CARE's GTS timing code (`QD`, `BID`, `TID`, `QID`, `QOD`, `QnH`, `WK`, `MO`). Once a day with `when` set to `HS` or `MORN` becomes `HS` or `AM`. `dosage.text` is kept, which CARE also accepts as a frequency.
- **Duration:** from `timing.repeat.duration`, or `dispenseRequest.expectedSupplyDuration` when that's missing.
- **Dose and dose range:** only in CARE's own units (`{tbl}`, `g`, `mg`, `ug`, `mL`, `[drp]`, `[iU]`, `{count}`). Common spellings map to them (`tablet` is `{tbl}`, `mcg` is `ug`, `ml` is `mL`). Any other unit stays as text.
- **Route, site, method, as-needed reason, instructions:** kept when coded.
- **Nothing is dropped:** a `when` code, an uncoded value, or a dose in a unit CARE doesn't offer goes into `patient_instruction` as text (`Route: by mouth`, `Dose: 1 sachet`).

Every dosage field CARE can't take as sent is also listed in `review`, with its field path (`dosage_instruction.0.route`), the issue (`uncoded`, `missing` or `unit_not_in_care`), the scribe's text and, for coded fields, CARE's value set.

### Not mapped yet

Vitals, lab results, lifestyle, examination findings, lab and procedure orders, procedure history, family history, immunizations, follow-up appointments, advice and clinical notes all come back in `unmapped`. CARE records these through questionnaire observations, activity definitions or appointments, which need facility-specific ids.

## Tests

```bash
npm test
```
