export const punjabiParagraphs = [
  "ਭਾਰਤ ਵੱਖ-ਵੱਖ ਸਭਿਆਚਾਰ ਅਤੇ ਭਾਸ਼ਾ ਵਾਲਾ ਦੇਸ਼ ਹੈ.",
  "ਨਿਯਮਿਤ ਅਭਿਆਸ ਨਾਲ ਲਿਖਣ ਦੀ ਗਤੀ ਅਤੇ ਸ਼ੁੱਧਤਾ ਵੱਧਦੀ ਹੈ.",
  "ਸਹੀ ਬੈਠਣ ਦੀ ਸਥਿਤੀ ਅਤੇ ਆਰਾਮਦਾਇਕ ਹੱਥ ਅਭਿਆਸ ਲਈ ਜ਼ਰੂਰੀ ਹਨ.",
  "ਤਕਨੀਕ ਸਿੱਖਣਾ ਪੜ੍ਹਾਈ, ਨੌਕਰੀ ਅਤੇ ਰੋਜ਼ਾਨਾ ਕਾਰਜ ਲਈ ਲਾਭਦਾਇਕ ਹੈ.",
];

const punjabiHomeRow = [
  "ਪੋ ਪੇ ਪਿ ਪੁ ਪਰ ਪਕ ਪਤ ਪਚ ਪਟ",
  "ਪੋ ਪੇ ਪਿ ਪੁ ਫਰ ਖਰ ਥਰ ਛਰ ਠਰ",
  "ਪੋਪੇ ਪਿਪੁ ਪਰ ਪਕ ਪਤ ਪਚ ਪਟ",
];
const punjabiTopRow = [
  "ਬੌ ਬੈ ਬਾ ਬੀ ਬੂ ਭੌ ਹੈ ਗੈ ਦੈ ਜੈ ਡੈ",
  "ਬੌ ਬੈ ਬਾ ਬੀ ਬੂ ਭੌ ਹੌ ਗੌ ਦੌ ਜੌ ਡੌ",
  "ਬੌ ਬੈ ਬੌ ਬੈ ਬਾ ਬੀ ਬੂ ਭੌ ਹੈ ਗੈ",
];
const punjabiBottomRow = [
  "ਮਂ ਮਨ ਮਵ ਮਲ ਮਸ ਮਯ",
  "ਮ਼ ਮਂ ਮਨ ਮਵ ਮਲ ਮਸ ਮਯ",
  "ਮਂ ਮਂ ਮਨ ਮਨ ਮਵ ਮਲ ਮਸ ਮਯ",
];
const punjabiShiftDrill = [
  "ਓ ਏ ਅ ਇ ਉ ਫ ਖ ਥ ਛ ਠ",
  "ਫੋ ਫੇ ਫਿ ਫੁ ਫਖ ਫਥ",
];
const punjabiNumberDrill = ["੧੨੩੪੫੬੭੮੯੦", "੦੯੮੭੬੫੪੩੨੧"];
const punjabiPunctuationDrill = [", . ?", "? , ."];
const punjabiCombinedRows = [
  ...punjabiHomeRow.slice(0, 1),
  ...punjabiTopRow.slice(0, 1),
  ...punjabiBottomRow.slice(0, 1),
];

export const punjabiParagraphsByChapter = {
  "chapter-1": punjabiHomeRow,
  "chapter-2": punjabiTopRow,
  "chapter-3": punjabiBottomRow,
  "chapter-4": punjabiCombinedRows,
  "chapter-5": punjabiTopRow,
  "chapter-6": punjabiBottomRow,
  "chapter-7": [...punjabiHomeRow.slice(0, 1), ...punjabiTopRow.slice(0, 1)],
  "chapter-8": [...punjabiHomeRow.slice(0, 1), ...punjabiBottomRow.slice(0, 1)],
  "chapter-9": punjabiParagraphs,
  "chapter-10": punjabiShiftDrill,
  "chapter-11": punjabiNumberDrill,
  "chapter-12": punjabiPunctuationDrill,
  "chapter-13": punjabiParagraphs,
  "chapter-14": punjabiParagraphs,
  "chapter-15": punjabiParagraphs,
};
