import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toDosageInstruction } from "../src/parsers/dosage.js";

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
