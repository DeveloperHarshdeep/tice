import { getExpectedCodes, keyboardLayouts } from "./keyboard-layouts";
import { convertAnmolInput } from "./typing/converters/anmol";
import { typingParagraphs } from "./typing/paragraphs";

export const typingSystems = {
  "english-qwerty": {
    id: "english-qwerty",
    language: "english",
    label: "English",
    font: { id: "english-default", name: "English (Default)", family: "inherit" },
    keyboardLayoutId: "english-qwerty",
    keyboardLayout: keyboardLayouts["english-qwerty"],
    inputMode: "unicode",
    outputEncoding: "unicode",
    paragraphSource: "chapter",
    normalization: "NFC",
    status: "ready",
  },
  "hindi-mangal-inscript": {
    id: "hindi-mangal-inscript",
    language: "hindi",
    label: "Hindi · Mangal",
    font: { id: "mangal", name: "Mangal", family: "Mangal, Nirmala UI, sans-serif" },
    keyboardLayoutId: "hindi-mangal-inscript",
    keyboardLayout: keyboardLayouts["hindi-mangal-inscript"],
    paragraphs: typingParagraphs["hindi-mangal-inscript"],
    inputMode: "unicode",
    outputEncoding: "unicode",
    paragraphSource: "system-chapter",
    normalization: "NFC",
    status: "ready",
  },
  "hindi-nirmala-inscript": {
    id: "hindi-nirmala-inscript",
    language: "hindi",
    label: "Hindi · Nirmala UI",
    font: { id: "nirmala", name: "Nirmala UI", family: "Nirmala UI, Mangal, sans-serif" },
    keyboardLayoutId: "hindi-nirmala-inscript",
    keyboardLayout: null,
    paragraphs: null,
    inputMode: null,
    outputEncoding: null,
    paragraphSource: "system-chapter",
    normalization: "NFC",
    status: "unavailable",
    unavailableReason: "No independently verified Nirmala UI typing-system mapping is configured.",
  },
  "punjabi-raavi": {
    id: "punjabi-raavi",
    language: "punjabi",
    label: "Punjabi · Raavi",
    font: { id: "raavi", name: "Raavi", family: "Raavi, Gurmukhi MT, sans-serif" },
    keyboardLayoutId: "punjabi-raavi-inscript",
    keyboardLayout: keyboardLayouts["punjabi-raavi-inscript"],
    paragraphs: typingParagraphs["punjabi-raavi"],
    inputMode: "unicode",
    outputEncoding: "unicode",
    paragraphSource: "system-chapter",
    normalization: "NFC",
    status: "ready",
  },
  "punjabi-anmol": {
    id: "punjabi-anmol",
    language: "punjabi",
    label: "Punjabi · AnmolLipi",
    font: {
      id: "gurmukhi-unicode",
      name: "Gurmukhi Unicode (AnmolLipi input)",
      family: "Raavi, Nirmala UI, Gurmukhi MT, sans-serif",
    },
    keyboardLayoutId: "punjabi-anmol-lipi",
    keyboardLayout: keyboardLayouts["punjabi-anmol-lipi"],
    paragraphs: typingParagraphs["punjabi-anmol"],
    inputMode: "custom-conversion",
    outputEncoding: "unicode",
    converter: convertAnmolInput,
    paragraphSource: "system-chapter",
    normalization: "NFC",
    status: "ready",
  },
  "punjabi-amrit": {
    id: "punjabi-amrit",
    language: "punjabi",
    label: "Punjabi · Amrit",
    font: { id: "amrit", name: "Amrit", family: "Amrit, Gurmukhi MT, sans-serif" },
    keyboardLayoutId: "punjabi-amrit",
    keyboardLayout: null,
    paragraphs: null,
    inputMode: null,
    outputEncoding: null,
    paragraphSource: "system-chapter",
    normalization: "NFC",
    status: "unavailable",
    unavailableReason: "A verified Amrit keyboard map and compatible paragraph encoding are not available.",
  },
};

const typingSystemAliases = {
  "punjabi-raavi-inscript": "punjabi-raavi",
  "punjabi-anmol-inscript": "punjabi-anmol",
  "punjabi-amrit-inscript": "punjabi-amrit",
};

export function normalizeTypingSystemId(typingSystemId) {
  return typingSystemAliases[typingSystemId] || typingSystemId;
}

export const typingLanguages = [
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi" },
  { id: "punjabi", label: "Punjabi" },
];

export function getTypingSystemsForLanguage(languageId) {
  return Object.values(typingSystems).filter(
    (system) => system.language === languageId,
  );
}

function getParagraphText(paragraph, inputMode) {
  return inputMode === "custom-conversion" ? paragraph?.text : paragraph;
}

export function validateTypingSystem(typingSystemId, chapter) {
  const system = typingSystems[normalizeTypingSystemId(typingSystemId)];
  if (!system) {
    return { valid: false, errors: ["Select a supported typing system."] };
  }

  const errors = [];
  if (system.status !== "ready") {
    errors.push(system.unavailableReason || "This typing system is unavailable.");
  }
  if (!system.font?.family) errors.push("A font is not configured.");
  if (
    system.status === "ready" &&
    !["unicode", "legacy", "custom-conversion"].includes(system.inputMode)
  ) {
    errors.push("A verified input mode is not configured.");
  }
  if (
    system.status === "ready" &&
    !["unicode", "legacy"].includes(system.outputEncoding)
  ) {
    errors.push("A verified output encoding is not configured.");
  }

  const keyboardLayout = system.keyboardLayout;
  if (
    !keyboardLayout ||
    keyboardLayout.id !== system.keyboardLayoutId ||
    !Array.isArray(keyboardLayout.rows) ||
    !keyboardLayout.rows.length ||
    !keyboardLayout.mapping ||
    !["browser-key", "physical-key"].includes(keyboardLayout.keyInputMode) ||
    (keyboardLayout.keyInputMode === "physical-key" &&
      typeof keyboardLayout.mappingSource !== "string")
  ) {
    errors.push("A verified keyboard layout is not configured.");
  } else {
    const keys = keyboardLayout.rows.flat();
    const codes = keys.map((keyInfo) => keyInfo.code);
    if (codes.some((code) => !code) || new Set(codes).size !== codes.length) {
      errors.push("The keyboard layout has missing or duplicate physical keys.");
    }
    if (
      keyboardLayout.keyInputMode === "physical-key" &&
      keys.some(
        (keyInfo) =>
          !keyInfo.label &&
          !keyInfo.normal &&
          !keyInfo.shift &&
          !keyInfo.altGr &&
          !keyInfo.shiftAltGr,
      )
    ) {
      errors.push("The keyboard layout contains an unmapped key.");
    }
  }

  let paragraphs = [];
  if (system.paragraphSource === "chapter") {
    if (
      !Array.isArray(chapter?.paragraphs) ||
      chapter.paragraphs.length === 0 ||
      chapter.paragraphs.some(
        (paragraph) => typeof paragraph !== "string" || !paragraph,
      )
    ) {
      errors.push("This chapter has no practice paragraphs.");
    } else {
      paragraphs = chapter.paragraphs;
    }
  } else if (system.paragraphSource === "system-chapter") {
    const chapterParagraphs = system.paragraphs?.[chapter?.id];
    if (
      !Array.isArray(chapterParagraphs) ||
      chapterParagraphs.length === 0 ||
      chapterParagraphs.some((paragraph) =>
        system.inputMode === "custom-conversion"
          ? typeof paragraph?.input !== "string" ||
            !paragraph.input ||
            typeof paragraph.text !== "string" ||
            !paragraph.text
          : typeof paragraph !== "string" || !paragraph,
      )
    ) {
      errors.push("A verified paragraph set is not configured for this chapter.");
    } else {
      paragraphs = chapterParagraphs;
    }
  } else {
    errors.push("The paragraph source is not configured.");
  }

  if (system.inputMode === "custom-conversion" && system.converter) {
    for (const paragraph of paragraphs) {
      if (system.converter(paragraph.input) !== paragraph.text) {
        errors.push("An AnmolLipi paragraph does not match its converted Unicode text.");
        break;
      }
    }

    const unmappedInput = paragraphs
      .flatMap((paragraph) => Array.from(paragraph.input))
      .find((character) => !getExpectedCodes(character, system).length);
    if (unmappedInput) {
      errors.push(
        `An AnmolLipi input character has no key mapping: ${JSON.stringify(unmappedInput)}.`,
      );
    }
  } else {
    const unmappedCharacter = paragraphs
      .flatMap((paragraph) =>
        Array.from(getParagraphText(paragraph, system.inputMode) || ""),
      )
      .find((character) => !getExpectedCodes(character, system).length);
    if (unmappedCharacter) {
      errors.push(
        `The paragraph contains a character with no key mapping: ${JSON.stringify(unmappedCharacter)}.`,
      );
    }
  }

  return { valid: errors.length === 0, errors, system };
}
