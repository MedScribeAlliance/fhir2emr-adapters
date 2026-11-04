import { navigate } from "raviger";
import { useEffect, useRef, useState } from "react";

import { config } from "@/config";
import { KeyMissingError } from "@/crypto";
import { readDocUrls, stripReturnParams } from "@/handoff";
import {
  NoMedicinesError,
  RxQuestionnaireMissingError,
  openRxDraft,
} from "@/openRxDraft";
import { strings } from "@/strings";

interface Props {
  facilityId: string;
  patientId: string;
  encounterId: string;
}

function messageFor(err: unknown) {
  if (err instanceof KeyMissingError) return strings.keyMissing;
  if (err instanceof NoMedicinesError) return strings.noMedicines;
  if (err instanceof RxQuestionnaireMissingError) {
    return strings.questionnaireMissing(config.rxQuestionnaireSlug);
  }
  return strings.loadFailed;
}

// The scribe's Publish opens this page with a doc_url per note; it hands off to CARE's Rx pad.
export function VaartaReturnPage({
  facilityId,
  patientId,
  encounterId,
}: Props) {
  const encounterUrl = `/facility/${facilityId}/patient/${patientId}/encounter/${encounterId}/updates`;
  const [error, setError] = useState("");
  const started = useRef(false);

  // The doc_urls are read once: they are stripped from the address bar straight away.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const docUrls = readDocUrls(
      window.location.search,
      new URL(config.vaartaUrl).origin,
    );
    window.history.replaceState(
      null,
      "",
      stripReturnParams(window.location.href),
    );
    if (!docUrls.length) {
      setError(strings.noDocUrl);
      return;
    }
    openRxDraft(docUrls, { patientId, encounterId })
      .then(({ draftId, slug }) =>
        navigate(
          `/facility/${facilityId}/patient/${patientId}/encounter/${encounterId}/questionnaire/${slug}?continue_draft=${draftId}`,
          { replace: true },
        ),
      )
      .catch((err) => {
        console.error("open scribe note in rx pad", err);
        setError(messageFor(err));
      });
  }, [facilityId, patientId, encounterId]);

  return (
    <div className="mx-auto mt-16 max-w-md space-y-4 text-center text-sm">
      <p className={error ? "text-red-600" : "text-gray-600"}>
        {error || strings.loading}
      </p>
      {error && (
        <button
          type="button"
          className="rounded-md border border-gray-300 px-3 py-1.5"
          onClick={() => navigate(encounterUrl)}
        >
          {strings.backToEncounter}
        </button>
      )}
    </div>
  );
}
