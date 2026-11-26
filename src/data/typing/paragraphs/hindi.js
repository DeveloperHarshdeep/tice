export const hindiParagraphs = [
  "भारत एक विविधताओं से भरा देश है।",
  "हर दिन नियमित अभ्यास से टाइपिंग में सुधार होता है।",
  "सही मुद्रा, संतुलित बैठने की स्थिति और धैर्य आवश्यक हैं।",
  "कंप्यूटर सीखना पढ़ाई, नौकरी और जीवन के लिए उपयोगी है।",
];

const hindiHomeRow = [
  "पो पे पि पु पर पक पत पच पट पॉ",
  "पो पे पि पु पफ फर कर तर चर टर",
  "पोपे पिपु पर पक पत पच पट पॉ",
];
const hindiTopRow = [
  "बौ बै बा बी बू भौ हौ गै दौ जौ डौ",
  "बौ बै बा बी बू भौ है गै दै जै डै",
  "बौ बै बौ बै बा बी बू हौ है गै गै",
];
const hindiBottomRow = [
  "मं मन मव मल मस मय",
  "मॆ मं मन मव मल मस मय",
  "मं मं मन मन मव मल मस मय",
];
const hindiShiftDrill = [
  "ओ ए अ इ उ फ ख थ छ ठ ऑ",
  "फो फे फि फु फख फथ",
];
const hindiNumberDrill = ["१२३४५६७८९०", "०९८७६५४३२१"];
const hindiPunctuationDrill = [", . ।", "। , ."];
const hindiCombinedRows = [
  ...hindiHomeRow.slice(0, 1),
  ...hindiTopRow.slice(0, 1),
  ...hindiBottomRow.slice(0, 1),
];

export const hindiParagraphsByChapter = {
  "chapter-1": hindiHomeRow,
  "chapter-2": hindiTopRow,
  "chapter-3": hindiBottomRow,
  "chapter-4": hindiCombinedRows,
  "chapter-5": hindiTopRow,
  "chapter-6": hindiBottomRow,
  "chapter-7": [...hindiHomeRow.slice(0, 1), ...hindiTopRow.slice(0, 1)],
  "chapter-8": [...hindiHomeRow.slice(0, 1), ...hindiBottomRow.slice(0, 1)],
  "chapter-9": hindiParagraphs,
  "chapter-10": hindiShiftDrill,
  "chapter-11": hindiNumberDrill,
  "chapter-12": hindiPunctuationDrill,
  "chapter-13": hindiParagraphs,
  "chapter-14": hindiParagraphs,
  "chapter-15": hindiParagraphs,
};
