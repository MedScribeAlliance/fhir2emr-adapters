import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { convertFHIRToCare } from "../src/index.js";

const sample = JSON.parse(
  readFileSync(new URL("../../../scribe_output.json", import.meta.url)),
);
const bundle = (...resources) => ({
  resourceType: "Bundle",
  entry: resources.map((resource) => ({ resource })),
});
const snomed = (code, display) => ({
  coding: [{ system: "http://snomed.info/sct", code, display }],
});

describe("convertFHIRToCare", () => {
  it("rejects anything that is not a bundle", () => {
    assert.throws(() => convertFHIRToCare({ resourceType: "Patient" }));
  });

  it("maps the sample bundle into each CARE question type", () => {
    const care = convertFHIRToCare(sample, { encounter: "enc-1" });
    assert.equal(care.symptom.length, 2);
    assert.equal(care.diagnosis.length, 3);
    assert.equal(care.allergy_intolerance.length, 2);
    assert.equal(care.medication_request.length, 1);
    assert.equal(care.medication_statement.length, 1);
    assert.equal(care.medication_request[0].encounter, "enc-1");
    assert.equal(
      care.medication_request[0].dosage_instruction[0].timing.code.code,
      "TID",
    );
  });

  it("sets the category and priority CARE requires on every medicine", () => {
    const med = {
      resourceType: "MedicationRequest",
      medication: { concept: { text: "x" } },
    };
    const outpatient = convertFHIRToCare(
      bundle(
        { resourceType: "Encounter", class: [{ coding: [{ code: "AMB" }] }] },
        med,
      ),
    );
    const noEncounter = convertFHIRToCare(bundle(med));
    const explicit = convertFHIRToCare(
      bundle({
        ...med,
        category: [{ coding: [{ code: "discharge" }] }],
        priority: "urgent",
      }),
    );
    assert.deepEqual(
      [outpatient, noEncounter, explicit].map((c) => [
        c.medication_request[0].category,
        c.medication_request[0].priority,
      ]),
      [
        ["outpatient", "routine"],
        ["inpatient", "routine"],
        ["discharge", "urgent"],
      ],
    );
  });

  it("files medical history as a chronic condition", () => {
    const care = convertFHIRToCare(
      bundle({
        resourceType: "Condition",
        category: [{ coding: [{ code: "problem-list-item" }] }],
        code: { text: "Asthma" },
      }),
    );
    assert.equal(care.diagnosis[0].category, "chronic_condition");
  });

  it("refutes a symptom the patient said is absent", () => {
    const care = convertFHIRToCare(
      bundle({
        resourceType: "Observation",
        category: [{ coding: [{ code: "symptom" }] }],
        code: { text: "Chest pain" },
        component: [
          {
            code: snomed("408729009"),
            valueCodeableConcept: { text: "Absent" },
          },
        ],
      }),
    );
    assert.equal(care.symptom[0].verification_status, "refuted");
  });

  it("maps FHIR kebab-case codes to CARE's enums", () => {
    const care = convertFHIRToCare(
      bundle(
        {
          resourceType: "MedicationRequest",
          status: "stopped",
          intent: "original-order",
          medication: { concept: { text: "x" } },
        },
        {
          resourceType: "AllergyIntolerance",
          criticality: "unable-to-assess",
          code: { text: "y" },
        },
      ),
    );
    assert.equal(care.medication_request[0].status, "ended");
    assert.equal(care.medication_request[0].intent, "original_order");
    assert.equal(care.allergy_intolerance[0].criticality, "unable_to_assess");
  });

  it("lists text-only codes for the doctor to code", () => {
    const care = convertFHIRToCare(
      bundle(
        { resourceType: "Condition", code: { text: "Fever" } },
        { resourceType: "Condition", code: snomed("386661006", "Fever") },
      ),
    );
    assert.deepEqual(
      care.review.map((r) => [r.type, r.index, r.issue]),
      [["diagnosis", 0, "uncoded"]],
    );
  });

  it("reports resources CARE has no structured question for", () => {
    const care = convertFHIRToCare(sample);
    const types = new Set(care.unmapped.map((r) => r.resourceType));
    assert.ok(types.has("ServiceRequest"));
    assert.ok(types.has("CarePlan"));
    assert.ok(!types.has("Patient"));
    assert.ok(!types.has("Condition"));
  });
});
