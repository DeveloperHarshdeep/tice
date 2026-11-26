import { getAnmolTokenOutput } from "./typing/converters/anmol";

const key = (code, label, width) => ({ code, label, width });
const shiftedDigitLabels = "!@#$%^&*()";

export const englishKeyboardRows = [
  [
    key("Escape", "Esc", 1.4),
    ...["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"].map((code) => key(code, code)),
  ],
  [
    key("Backquote", "` ~"),
    ...["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((digit, index) => key(`Digit${digit}`, `${digit} ${shiftedDigitLabels[index]}`)),
    key("Minus", "- _"),
    key("Equal", "= +"),
    key("Backspace", "Backspace", 2.2),
  ],
  [
    key("Tab", "Tab", 1.7),
    ...[..."qwertyuiop"].map((letter) => key(`Key${letter.toUpperCase()}`, letter)),
    key("BracketLeft", "[ {"),
    key("BracketRight", "] }"),
    key("Backslash", "\\ |", 1.5),
  ],
  [
    key("CapsLock", "Caps", 2),
    ...[..."asdfghjkl"].map((letter) => key(`Key${letter.toUpperCase()}`, letter)),
    key("Semicolon", "; :"),
    key("Quote", "' \""),
    key("Enter", "Enter", 2.1),
  ],
  [
    key("ShiftLeft", "Shift", 2.8),
    ...[..."zxcvbnm"].map((letter) => key(`Key${letter.toUpperCase()}`, letter)),
    key("Comma", ", <"),
    key("Period", ". >"),
    key("Slash", "/ ?", 1.4),
    key("ShiftRight", "Shift", 2.8),
  ],
  [
    key("ControlLeft", "Ctrl", 1.5),
    key("MetaLeft", "Win", 1.4),
    key("AltLeft", "Alt", 1.4),
    key("Space", "Space", 6),
    key("AltRight", "Alt", 1.4),
    key("ContextMenu", "Menu", 1.4),
    key("ControlRight", "Ctrl", 1.5),
  ],
];

const nonCharacterKeyLabels = {
  Tab: "Tab",
  Backspace: "Backspace",
  Enter: "Enter",
  Space: "Space",
  CapsLock: "Caps",
  ShiftLeft: "Shift",
  ShiftRight: "Shift",
  ControlLeft: "Ctrl",
  ControlRight: "Ctrl",
  AltLeft: "Alt",
  AltRight: "Alt",
};

const inscript = (row) =>
  row.map(([code, normal, shift]) => {
    if (nonCharacterKeyLabels[code]) {
      return { code, label: nonCharacterKeyLabels[code] };
    }

    return {
      code,
      unshifted: normal,
      shifted: shift,
      normal,
      shift: shift || undefined,
    };
  });

const mappedKey = (code, normal, shift, altGr, shiftAltGr) => ({
  code,
  normal,
  shift,
  altGr,
  shiftAltGr,
});

export const hindiKeyboardRows = [
  [
    { code: "Backquote", normal: "ॊ", shift: "ऒ" },
    { code: "Digit1", normal: "१", shift: "ऍ" },
    { code: "Digit2", normal: "२", shift: "ॅ" },
    { code: "Digit3", normal: "३", shift: "#" },
    { code: "Digit4", normal: "४", shift: "$", altGr: "₹" },
    { code: "Digit5", normal: "५", shift: "ज्ञ" },
    { code: "Digit6", normal: "६", shift: "त्र" },
    { code: "Digit7", normal: "७", shift: "क्ष" },
    { code: "Digit8", normal: "८", shift: "श्र" },
    { code: "Digit9", normal: "९", shift: "(" },
    { code: "Digit0", normal: "०", shift: ")" },
    { code: "Minus", normal: "-", shift: "ः" },
    { code: "Equal", normal: "ृ", shift: "ऋ" },
    { code: "Backspace", label: "Backspace", width: 2.2 },
  ],
  [
    { code: "Tab", label: "Tab", width: 1.7 },
    ...[
      ["KeyQ", "ौ", "औ"], ["KeyW", "ै", "ऐ"], ["KeyE", "ा", "आ"],
      ["KeyR", "ी", "ई"], ["KeyT", "ू", "ऊ"], ["KeyY", "ब", "भ"],
      ["KeyU", "ह", "ङ"], ["KeyI", "ग", "घ"], ["KeyO", "द", "ध"],
      ["KeyP", "ज", "झ"], ["BracketLeft", "ड", "ढ"],
      ["BracketRight", "़", "ञ"],
    ].map(([code, normal, shift]) => mappedKey(code, normal, shift)),
    { code: "Enter", label: "Enter", width: 2.1 },
  ],
  [
    { code: "CapsLock", label: "Caps", width: 2 },
    ...[
      ["KeyA", "ो", "ओ"], ["KeyS", "े", "ए"], ["KeyD", "्", "अ"],
      ["KeyF", "ि", "इ"], ["KeyG", "ु", "उ"], ["KeyH", "प", "फ"],
      ["KeyJ", "र", "ऱ"], ["KeyK", "क", "ख"], ["KeyL", "त", "थ"],
      ["Semicolon", "च", "छ"], ["Quote", "ट", "ठ"],
      ["Backslash", "ॉ", "ऑ"],
    ].map(([code, normal, shift]) => mappedKey(code, normal, shift)),
  ],
  [
    { code: "ShiftLeft", label: "Shift", width: 2.8 },
    ...[
      ["KeyZ", "ॆ", "ऎ"], ["KeyX", "ं", "ँ"], ["KeyC", "म", "ण"],
      ["KeyV", "न", "ऩ"], ["KeyB", "व", "ऴ"], ["KeyN", "ल", "ळ"],
      ["KeyM", "स", "श"], ["Comma", ",", "ष"], ["Period", ".", "।"],
      ["Slash", "य", "य़"],
    ].map(([code, normal, shift]) => mappedKey(code, normal, shift)),
    { code: "ShiftRight", label: "Shift", width: 2.8 },
  ],
  [
    { code: "ControlLeft", label: "Ctrl" },
    { code: "AltLeft", label: "Alt" },
    { code: "Space", label: "Space", width: 6 },
    { code: "AltRight", label: "AltGr" },
    { code: "ControlRight", label: "Ctrl" },
  ],
];

export const punjabiKeyboardRows = [
  inscript([
    ["Backquote", "ੱ", "ੴ"], ["Digit1", "੧", "ੴ"], ["Digit2", "੨", ""], ["Digit3", "੩", ""],
    ["Digit4", "੪", ""], ["Digit5", "੫", ""], ["Digit6", "੬", ""], ["Digit7", "੭", ""],
    ["Digit8", "੮", "ੲ"], ["Digit9", "੯", "("], ["Digit0", "੦", ")"], ["Minus", "-", "_"], ["Equal", "=", "+"], ["Backspace", "Backspace", "Backspace"],
  ]),
  inscript([
    ["Tab", "Tab", "Tab"], ["KeyQ", "ੌ", "ਔ"], ["KeyW", "ੈ", "ਐ"], ["KeyE", "ਾ", "ਆ"], ["KeyR", "ੀ", "ਈ"],
    ["KeyT", "ੂ", "ਊ"], ["KeyY", "ਬ", "ਭ"], ["KeyU", "ਹ", "ਙ"], ["KeyI", "ਗ", "ਘ"], ["KeyO", "ਦ", "ਧ"],
    ["KeyP", "ਜ", "ਝ"], ["BracketLeft", "ਡ", "ਢ"], ["BracketRight", "਼", "ਞ"], ["Enter", "Enter", "Enter"],
  ]),
  inscript([
    ["CapsLock", "Caps", "Caps"], ["KeyA", "ੋ", "ਓ"], ["KeyS", "ੇ", "ਏ"], ["KeyD", "੍", "ਅ"], ["KeyF", "ਿ", "ਇ"],
    ["KeyG", "ੁ", "ਉ"], ["KeyH", "ਪ", "ਫ"], ["KeyJ", "ਰ", "ਰ"], ["KeyK", "ਕ", "ਖ"], ["KeyL", "ਤ", "ਥ"],
    ["Semicolon", "ਚ", "ਛ"], ["Quote", "ਟ", "ਠ"], ["Backslash", "੍", "ੴ"],
  ]),
  inscript([
    ["ShiftLeft", "Shift", "Shift"], ["KeyZ", "਼", "ੴ"], ["KeyX", "ਂ", "ਁ"], ["KeyC", "ਮ", "ਣ"],
    ["KeyV", "ਨ", "ਨ"], ["KeyB", "ਵ", "ੜ"], ["KeyN", "ਲ", "ਲ਼"], ["KeyM", "ਸ", "ਸ਼"],
    ["Comma", ",", "<"], ["Period", ".", ">"], ["Slash", "ਯ", "?"], ["ShiftRight", "Shift", "Shift"],
  ]),
  inscript([
    ["ControlLeft", "Ctrl", "Ctrl"], ["AltLeft", "Alt", "Alt"], ["Space", " ", " "],
    ["AltRight", "Alt", "Alt"], ["ControlRight", "Ctrl", "Ctrl"],
  ]),
];

const anmolKey = (code, normalInput, shiftInput, width) => ({
  code,
  normal: getAnmolTokenOutput(normalInput),
  shift: getAnmolTokenOutput(shiftInput),
  input: { normal: normalInput, shift: shiftInput },
  width,
});

const anmolSpecialKey = (code, label, width) => ({ code, label, width });

export const anmolKeyboardRows = [
  [
    anmolKey("Backquote", "`", "~"),
    ...[..."1234567890"].map((digit, index) =>
      anmolKey(`Digit${digit}`, digit, shiftedDigitLabels[index]),
    ),
    anmolKey("Minus", "-", "_"),
    anmolKey("Equal", "=", "+"),
    anmolSpecialKey("Backspace", "Backspace", 2.2),
  ],
  [
    anmolSpecialKey("Tab", "Tab", 1.7),
    ...[..."qwertyuiop"].map((letter) =>
      anmolKey(`Key${letter.toUpperCase()}`, letter, letter.toUpperCase()),
    ),
    anmolKey("BracketLeft", "[", "{"),
    anmolKey("BracketRight", "]", "}"),
    anmolKey("Backslash", "\\", "|", 1.5),
  ],
  [
    anmolSpecialKey("CapsLock", "Caps", 2),
    ...[..."asdfghjkl"].map((letter) =>
      anmolKey(`Key${letter.toUpperCase()}`, letter, letter.toUpperCase()),
    ),
    anmolKey("Semicolon", ";", ":"),
    anmolKey("Quote", "'", '"'),
    anmolSpecialKey("Enter", "Enter", 2.1),
  ],
  [
    anmolSpecialKey("ShiftLeft", "Shift", 2.8),
    ...[..."zxcvbnm"].map((letter) =>
      anmolKey(`Key${letter.toUpperCase()}`, letter, letter.toUpperCase()),
    ),
    anmolKey("Comma", ",", "<"),
    anmolKey("Period", ".", ">"),
    anmolKey("Slash", "/", "?"),
    anmolSpecialKey("ShiftRight", "Shift", 2.8),
  ],
  [
    anmolSpecialKey("ControlLeft", "Ctrl", 1.5),
    anmolSpecialKey("MetaLeft", "Win", 1.4),
    anmolSpecialKey("AltLeft", "Alt", 1.4),
    anmolSpecialKey("Space", "Space", 6),
    anmolSpecialKey("AltRight", "Alt", 1.4),
    anmolSpecialKey("ContextMenu", "Menu", 1.4),
    anmolSpecialKey("ControlRight", "Ctrl", 1.5),
  ],
];

function createKeyboardLayout(id, label, keyInputMode, rows, mappingSource) {
  const keys = rows.flat();
  return {
    id,
    label,
    keyInputMode,
    mappingSource,
    rows,
    mapping: Object.fromEntries(keys.map((keyInfo) => [keyInfo.code, keyInfo])),
  };
}

export const keyboardLayouts = {
  "english-qwerty": createKeyboardLayout(
    "english-qwerty",
    "English QWERTY",
    "browser-key",
    englishKeyboardRows,
  ),
  "hindi-mangal-inscript": createKeyboardLayout(
    "hindi-mangal-inscript",
    "Mangal InScript",
    "physical-key",
    hindiKeyboardRows,
    "https://raw.githubusercontent.com/mike-fabian/m17n-db/master/MIM/hi-inscript.mim",
  ),
  "punjabi-raavi-inscript": createKeyboardLayout(
    "punjabi-raavi-inscript",
    "Punjabi Raavi InScript",
    "physical-key",
    punjabiKeyboardRows,
    "Existing TICE Raavi mapping retained unchanged.",
  ),
  "punjabi-anmol-lipi": createKeyboardLayout(
    "punjabi-anmol-lipi",
    "AnmolLipi legacy keyboard",
    "physical-key",
    anmolKeyboardRows,
    "https://github.com/shabados/shabados/blob/d0f2ef368aed7337adb7eecd116cb87733aeb2c5/packages/gurmukhi/src/unicode.rs",
  ),
};

export function getExpectedCodes(character, typingSystem) {
  if (!character) return [];
  if (character === " ") return ["Space"];
  if (character === "\n") return ["Enter"];

  const keyboardLayout = typingSystem?.keyboardLayout;
  if (!keyboardLayout) return [];

  if (typingSystem.inputMode === "custom-conversion") {
    for (const row of keyboardLayout.rows) {
      for (const keyInfo of row) {
        for (const [layer, token] of Object.entries(keyInfo.input || {})) {
          if (token !== character) continue;
          const modifiers =
            layer === "shift"
              ? ["ShiftLeft"]
              : layer === "altGr"
                ? ["AltRight"]
                : layer === "shiftAltGr"
                  ? ["ShiftLeft", "AltRight"]
                  : [];
          return [...modifiers, keyInfo.code];
        }
      }
    }
    return [];
  }

  if (keyboardLayout.keyInputMode === "physical-key") {
    for (const row of keyboardLayout.rows) {
      for (const keyInfo of row) {
        for (const layer of ["normal", "shift", "altGr", "shiftAltGr"]) {
          const output = keyInfo[layer];
          if (output && character.startsWith(output)) {
            const modifiers =
              layer === "shift"
                ? ["ShiftLeft"]
                : layer === "altGr"
                  ? ["AltRight"]
                  : layer === "shiftAltGr"
                    ? ["ShiftLeft", "AltRight"]
                    : [];
            return [...modifiers, keyInfo.code];
          }
        }
      }
    }
    return [];
  }

  if (/^[0-9]$/.test(character)) return [`Digit${character}`];
  if (/^[a-z]$/i.test(character)) {
    return [character === character.toUpperCase() ? "ShiftLeft" : "", `Key${character.toUpperCase()}`].filter(Boolean);
  }
  const shifted = {
    "!": "Digit1", "@": "Digit2", "#": "Digit3", "$": "Digit4", "%": "Digit5",
    "^": "Digit6", "&": "Digit7", "*": "Digit8", "(": "Digit9", ")": "Digit0",
    _: "Minus", "+": "Equal", "{": "BracketLeft", "}": "BracketRight", "|": "Backslash",
    ":": "Semicolon", '"': "Quote", "<": "Comma", ">": "Period", "?": "Slash", "~": "Backquote",
  };
  if (shifted[character]) return ["ShiftLeft", shifted[character]];
  const punctuation = {
    "`": "Backquote", "-": "Minus", "=": "Equal", "[": "BracketLeft", "]": "BracketRight",
    "\\": "Backslash", ";": "Semicolon", "'": "Quote", ",": "Comma", ".": "Period", "/": "Slash",
  };
  return punctuation[character] ? [punctuation[character]] : [];
}

export function getMappedOutput(event, typingSystem) {
  const keyboardLayout = typingSystem?.keyboardLayout;
  if (!keyboardLayout) return null;
  if (keyboardLayout.keyInputMode === "browser-key") return event.key;
  if (event.code === "Space") return " ";
  if (event.code === "Enter") return "\n";
  if (event.code === "Backspace") return null;

  const shift = event.shiftKey;
  const altGraph =
    event.getModifierState?.("AltGraph") || (event.altKey && event.ctrlKey);
  const keyInfo = keyboardLayout.mapping[event.code];
  if (!keyInfo) return null;
  const layer = shift && altGraph
    ? "shiftAltGr"
    : altGraph
      ? "altGr"
      : shift
        ? "shift"
        : "normal";
  if (typingSystem.inputMode === "custom-conversion") {
    return keyInfo.input?.[layer] ?? null;
  }
  return keyInfo[layer] ?? null;
}
