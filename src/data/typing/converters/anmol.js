const sequenceMappings = [
  ["<>", "ੴ"],
  ["AW", "ਆਂ"],
  ["Aw", "ਆ"],
  ["AY", "ਐ"],
  ["AO", "ਔ"],
  ["aU", "ਊ"],
  ["au", "ਉ"],
  ["eI", "ਈ"],
  ["ey", "ਏ"],
  ["ie", "ਇ"],
];

const characterMappings = {
  a: "ੳ",
  A: "ਅ",
  e: "ੲ",
  E: "ਓ",
  s: "ਸ",
  h: "ਹ",
  k: "ਕ",
  K: "ਖ",
  g: "ਗ",
  G: "ਘ",
  "|": "ਙ",
  c: "ਚ",
  C: "ਛ",
  j: "ਜ",
  J: "ਝ",
  "\\": "ਞ",
  t: "ਟ",
  T: "ਠ",
  f: "ਡ",
  F: "ਢ",
  x: "ਣ",
  q: "ਤ",
  Q: "ਥ",
  d: "ਦ",
  D: "ਧ",
  n: "ਨ",
  p: "ਪ",
  P: "ਫ",
  b: "ਬ",
  B: "ਭ",
  m: "ਮ",
  X: "ਯ",
  r: "ਰ",
  l: "ਲ",
  v: "ਵ",
  V: "ੜ",
  S: "ਸ਼",
  z: "ਜ਼",
  "^": "ਖ਼",
  "&": "ਫ਼",
  Z: "ਗ਼",
  L: "ਲ਼",
  w: "ਾ",
  i: "ਿ",
  I: "ੀ",
  u: "ੁ",
  U: "ੂ",
  y: "ੇ",
  Y: "ੈ",
  o: "ੋ",
  O: "ੌ",
  W: "ਾਂ",
  M: "ੰ",
  N: "ਂ",
  "~": "ੱ",
  "`": "ੱ",
  "@": "ੑ",
  R: "੍ਰ",
  H: "੍ਹ",
  "[": "।",
  "]": "॥",
  "0": "੦",
  "1": "੧",
  "2": "੨",
  "3": "੩",
  "4": "੪",
  "5": "੫",
  "6": "੬",
  "7": "੭",
  "8": "੮",
  "9": "੯",
};

const baseLetters = new Set(
  Array.from("ਅੳੲਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਵੜਸ਼ਜ਼ਖ਼ਫ਼ਗ਼ਲ਼"),
);
const vowelCarriers = [
  ["ੳੋ", "ਓ"],
  ["ਅਾ", "ਆ"],
  ["ੲਿ", "ਇ"],
  ["ੲੀ", "ਈ"],
  ["ੳੁ", "ਉ"],
  ["ੳੂ", "ਊ"],
  ["ੲੇ", "ਏ"],
  ["ਅੈ", "ਐ"],
  ["ਅੌ", "ਔ"],
];

function tokenizeInput(input) {
  const tokens = [];
  let index = 0;

  while (index < input.length) {
    const sequence = sequenceMappings.find(([source]) =>
      input.startsWith(source, index),
    );
    if (sequence) {
      tokens.push({ source: sequence[0], output: sequence[1], isSequence: true });
      index += sequence[0].length;
      continue;
    }

    const source = input[index];
    tokens.push({
      source,
      output: characterMappings[source] || source,
      isSequence: false,
    });
    index += 1;
  }

  return tokens;
}

function reorderSihari(tokens) {
  const ordered = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const next = tokens[index + 1];
    if (
      token.source === "i" &&
      !token.isSequence &&
      next &&
      !next.isSequence &&
      baseLetters.has(next.output)
    ) {
      ordered.push(next, token);
      index += 1;
    } else {
      ordered.push(token);
    }
  }
  return ordered;
}

export function getAnmolTokenOutput(token) {
  return characterMappings[token] || token;
}

export function convertAnmolInput(input) {
  if (typeof input !== "string") {
    throw new TypeError("Anmol input must be a string.");
  }

  let output = reorderSihari(tokenizeInput(input))
    .map((token) => token.output)
    .join("");

  for (const [sequence, vowel] of vowelCarriers) {
    output = output.replaceAll(sequence, vowel);
  }

  return output.normalize("NFC");
}
