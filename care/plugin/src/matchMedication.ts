import { careApi } from "@/api";
import { Code } from "@/types";

// CARE's own medicine search, so the top hit is what the doctor would see first when typing the name.
export async function matchMedication(
  medication: Code,
): Promise<Code | undefined> {
  if (medication.code || !medication.display) return undefined;
  try {
    const { results } = await careApi.searchValueSet(
      "system-medication",
      `${medication.display} clinical drug`,
      1,
    );
    const hit = results[0];
    return hit && { system: hit.system, code: hit.code, display: hit.display };
  } catch (error) {
    console.warn(`match scribe medication "${medication.display}"`, error);
    return undefined;
  }
}
