import { convertFHIRToCare } from "care-emr-adapter";

import { careApi } from "@/api";
import { config } from "@/config";
import { fetchScribeNote } from "@/crypto";
import { deleteKey } from "@/keyStore";
import { matchMedication } from "@/matchMedication";
import { adviceOf, hasRxQuestion, toDraftState, toRxRows } from "@/rxPad";

export class NoMedicinesError extends Error {}
export class RxQuestionnaireMissingError extends Error {}

interface Ids {
  patientId: string;
  encounterId: string;
}

// 1. decrypt each note  2. convert it to CARE's values  3. code the medicines  4. save as a CARE draft
export async function openRxDraft(
  docUrls: string[],
  { patientId, encounterId }: Ids,
) {
  const notes = await Promise.all(docUrls.map(fetchScribeNote));
  await Promise.all(notes.flatMap((n) => (n.kid ? [deleteKey(n.kid)] : [])));
  const care = notes.map((n) =>
    convertFHIRToCare(n.bundle, { encounter: encounterId }),
  );
  const meds = care.flatMap((c) => c.medication_request);
  if (!meds.length) throw new NoMedicinesError();

  const questionnaire = await careApi
    .questionnaire(config.rxQuestionnaireSlug)
    .catch(() => undefined);
  if (!questionnaire || !hasRxQuestion(questionnaire)) {
    throw new RxQuestionnaireMissingError();
  }

  const [requester, matches] = await Promise.all([
    careApi.currentUser(),
    Promise.all(meds.map((med) => matchMedication(med.medication))),
  ]);
  const rows = toRxRows(meds, matches, {
    encounter: encounterId,
    requester,
    advice: adviceOf(care),
    now: new Date().toISOString(),
  });
  const draft = await careApi.createDraft({
    patient: patientId,
    encounter: encounterId,
    questionnaire: questionnaire.slug,
    status: "draft",
    response_dump: {
      questionnaireResponses: toDraftState(questionnaire, rows),
    },
  });
  return { draftId: draft.id, slug: questionnaire.slug };
}
