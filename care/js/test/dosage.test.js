import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { dosageReviewOf, toDosageInstruction } from "../src/parsers/dosage.js";

describe("toDosageInstruction timing code", () => {
  const cases = [
    {
      name: "three a day is TID",
      repeat: { frequency: 3, period: 1, periodUnit: "d" },
      code: "TID",
    },
    {
      name: "once a day is QD",
      repeat: { frequency: 1, period: 1, periodUnit: "d" },
      code: "QD",
    },
    {
      name: "once a day at bedtime is HS",
      repeat: { frequency: 1, period: 1, periodUnit: "d", when: ["HS"] },
      code: "HS",
    },
    {
      name: "once every 8 hours is Q8H",
      repeat: { frequency: 1, period: 8, periodUnit: "h" },
      code: "Q8H",
    },
    {
      name: "every other day is QOD",
      repeat: { frequency: 1, period: 2, periodUnit: "d" },
      code: "QOD",
    },
    {
      name: "five a day has no preset code",
      repeat: { frequency: 5, period: 1, periodUnit: "d" },
      code: undefined,
    },
  ];
  for (const c of cases) {
    it(c.name, () => {
      const d = toDosageInstruction({ timing: { repeat: c.repeat } });
      assert.equal(d.timing.code?.code, c.code);
    });
  }
});

describe("toDosageInstruction treatment length", () => {
  it("takes bounds from timing.repeat.duration", () => {
    const d = toDosageInstruction({
      timing: {
        repeat: {
          frequency: 2,
          period: 1,
          periodUnit: "d",
          duration: 5,
          durationUnit: "d",
        },
      },
    });
    assert.deepEqual(d.timing.repeat.bounds_duration, {
      value: "5",
      unit: "d",
    });
  });

  it("falls back to the dispense supply duration", () => {
    const d = toDosageInstruction(
      { timing: { repeat: { frequency: 2, period: 1, periodUnit: "d" } } },
      { value: 2, code: "wk" },
    );
    assert.deepEqual(d.timing.repeat.bounds_duration, {
      value: "2",
      unit: "wk",
    });
  });

  it("leaves bounds out when neither is given", () => {
    const d = toDosageInstruction({
      timing: { repeat: { frequency: 2, period: 1, periodUnit: "d" } },
    });
    assert.equal(d.timing.repeat.bounds_duration, undefined);
  });
});

describe("toDosageInstruction coded fields", () => {
  it("keeps a coded route and drops a text-only one", () => {
    const coded = toDosageInstruction({
      route: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "26643006",
            display: "Oral",
          },
        ],
      },
    });
    const text = toDosageInstruction({ route: { text: "by mouth" } });
    assert.equal(coded.route.code, "26643006");
    assert.equal(text.route, undefined);
  });

  it("moves meal timing and uncoded instructions into the patient instruction", () => {
    const d = toDosageInstruction({
      timing: {
        repeat: { frequency: 3, period: 1, periodUnit: "d", when: ["PC"] },
      },
      additionalInstruction: [{ text: "with water" }],
    });
    assert.equal(d.patient_instruction, "After meals, with water");
    assert.equal(d.additional_instruction, undefined);
  });

  it("marks a dose as needed when a reason is given", () => {
    const d = toDosageInstruction({ asNeededFor: [{ text: "fever" }] });
    assert.equal(d.as_needed_boolean, true);
  });
});

const snomed = (code, display) => ({
  coding: [{ system: "http://snomed.info/sct", code, display }],
});
const dose = (value, unit, code) => ({
  doseAndRate: [{ doseQuantity: { value, unit, ...(code && { code }) } }],
});

describe("toDosageInstruction dose unit", () => {
  const cases = [
    {
      name: "tablet becomes CARE's {tbl}",
      input: dose(1, "tablet"),
      code: "{tbl}",
    },
    { name: "mcg becomes ug", input: dose(250, "mcg"), code: "ug" },
    { name: "ml becomes mL", input: dose(5, "ml"), code: "mL" },
    {
      name: "a CARE code passes through",
      input: dose(2, "drops", "[drp]"),
      code: "[drp]",
    },
  ];
  for (const c of cases) {
    it(c.name, () => {
      const d = toDosageInstruction(c.input);
      assert.equal(d.dose_and_rate.dose_quantity.unit.code, c.code);
      assert.equal(
        d.dose_and_rate.dose_quantity.unit.system,
        "http://unitsofmeasure.org",
      );
    });
  }

  it("keeps a unit CARE doesn't offer as text for the doctor", () => {
    const d = toDosageInstruction(dose(1, "sachet"));
    assert.equal(d.dose_and_rate, undefined);
    assert.equal(d.patient_instruction, "Dose: 1 sachet");
  });

  it("maps a dose range", () => {
    const d = toDosageInstruction({
      doseAndRate: [
        {
          doseRange: {
            low: { value: 1, unit: "tablet" },
            high: { value: 2, unit: "tablet" },
          },
        },
      ],
    });
    assert.deepEqual(
      [
        d.dose_and_rate.dose_range.low.value,
        d.dose_and_rate.dose_range.high.value,
      ],
      ["1", "2"],
    );
  });
});

describe("toDosageInstruction value-set fields", () => {
  it("keeps coded route, site and method", () => {
    const d = toDosageInstruction({
      route: snomed("26643006", "Oral"),
      site: snomed("368208006", "Left arm"),
      method: snomed("421521009", "Swallow"),
    });
    assert.deepEqual(
      [d.route.code, d.site.code, d.method.code],
      ["26643006", "368208006", "421521009"],
    );
  });

  it("moves text-only ones into the patient instruction instead of dropping them", () => {
    const d = toDosageInstruction({
      route: { text: "by mouth" },
      asNeededFor: [{ text: "fever" }],
    });
    assert.equal(d.route, undefined);
    assert.equal(d.patient_instruction, "Route: by mouth, When needed: fever");
  });
});

describe("dosageReviewOf", () => {
  it("lists every field the doctor must set in the Rx pad", () => {
    const issues = dosageReviewOf({
      route: { text: "by mouth" },
      ...dose(1, "sachet"),
      timing: { repeat: { frequency: 2, period: 1, periodUnit: "d" } },
    });
    assert.deepEqual(
      issues.map((i) => [i.field, i.issue]),
      [
        ["route", "uncoded"],
        ["dose_and_rate", "unit_not_in_care"],
        ["timing.repeat.bounds_duration", "missing"],
      ],
    );
    assert.equal(issues[0].valueSet, "system-route");
  });

  it("flags a dosage with no dose and no frequency", () => {
    assert.deepEqual(
      dosageReviewOf({}).map((i) => [i.field, i.issue]),
      [
        ["dose_and_rate", "missing"],
        ["timing", "missing"],
      ],
    );
  });

  it("finds nothing to fix in a complete coded dosage", () => {
    assert.deepEqual(
      dosageReviewOf({
        text: "1 tablet thrice daily",
        route: snomed("26643006", "Oral"),
        ...dose(1, "tablet"),
        timing: {
          repeat: {
            frequency: 3,
            period: 1,
            periodUnit: "d",
            duration: 5,
            durationUnit: "d",
          },
        },
      }),
      [],
    );
  });
});
