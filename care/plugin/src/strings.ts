export const strings = {
  takeNotes: "Take Notes On Vaarta",
  language: "Language",
  template: "Template",
  start: "Start",
  cancel: "Cancel",
  handoffFailed: "Couldn't start Vaarta. Try again.",
  loading: "Loading the note from Vaarta…",
  noDocUrl: "Vaarta didn't send a note to open.",
  keyMissing:
    "This browser can't open that Vaarta note. Start Take Notes On Vaarta again from this encounter and publish once more.",
  loadFailed:
    "Couldn't load the note from Vaarta. Publish it again from Vaarta.",
  noMedicines: "The note from Vaarta has no prescriptions to add.",
  questionnaireMissing: (slug: string) =>
    `CARE has no questionnaire "${slug}" with a medication request question. Ask an admin to create it (see the care_vaarta README).`,
  backToEncounter: "Back to encounter",
};
