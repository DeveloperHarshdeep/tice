import { anmolParagraphsByChapter } from "./anmol";
import { hindiParagraphs, hindiParagraphsByChapter } from "./hindi";
import { punjabiParagraphs, punjabiParagraphsByChapter } from "./punjabi";

export { anmolParagraphsByChapter, hindiParagraphs, punjabiParagraphs };

export const typingParagraphs = {
  "hindi-mangal-inscript": hindiParagraphsByChapter,
  "punjabi-raavi": punjabiParagraphsByChapter,
  "punjabi-anmol": anmolParagraphsByChapter,
};
