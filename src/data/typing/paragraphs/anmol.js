import { convertAnmolInput } from "../converters/anmol";

const anmolInputByChapter = {
  "chapter-1": [
    "asdfghjkl",
    "asdf jkl; asdf jkl;",
    "a s d f g h j k l",
  ],
  "chapter-2": [
    "qwertyuiop",
    "qwer tyui op",
    "poiuytrewq",
  ],
  "chapter-3": [
    "zxcvbnm",
    "zxcv bnm zxcv bnm",
    "z x c v b n m",
  ],
  "chapter-4": [
    "asdf qwer zxcv",
    "jkl; uiop bnm",
    "qwerty asdf zxcv",
  ],
  "chapter-5": [
    "qwer uiop qwer uiop",
    "the top row: qwertyuiop",
    "qwertyuiop poiuytrewq",
  ],
  "chapter-6": [
    "zxcv bnm zxcv bnm",
    "zxcvbnm mnbvcxz",
    "z x c v b n m",
  ],
  "chapter-7": [
    "qwer asdf zxcv",
    "tyui ghjk bnm",
    "qwerty asdfghjkl zxcvbnm",
  ],
  "chapter-8": [
    "asdf jkl; qwer uiop",
    "zxcv bnm qwer asdf",
    "qwerty asdf zxcvbnm",
  ],
  "chapter-9": [
    "pMjwbI BwSw",
    "Bwrq pMjwbI BwSw",
    "ik kI kY kO kU",
  ],
  "chapter-10": [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM QWERTY ASDF",
  ],
  "chapter-11": [
    "12345 67890",
    "09876 54321",
    "2026 123 456",
  ],
  "chapter-12": [
    "[] , . ?",
    "<> ^ & @ ` ~",
    "[] <> , .",
  ],
  "chapter-13": [
    "pMjwbI BwSw Bwrq",
    "kI kY kO kU pMjwbI",
    "qwerty asdf zxcv 123",
  ],
  "chapter-14": [
    "pMjwbI BwSw Bwrq 12345",
    "QWERTY asdfghjkl zxcvbnm",
    "ik kI kY kO kU [] <>",
  ],
  "chapter-15": [
    "pMjwbI BwSw Bwrq 1234567890",
    "QWERTYUIOP ASDFGHJKL ZXCVBNM",
    "ik kI kY kO kU pMjwbI BwSw",
  ],
};

export const anmolParagraphsByChapter = Object.fromEntries(
  Object.entries(anmolInputByChapter).map(([chapterId, inputs]) => [
    chapterId,
    inputs.map((input) => ({
      input,
      text: convertAnmolInput(input),
    })),
  ]),
);
