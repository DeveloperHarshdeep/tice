export function calculateTypingPerformance(
  typed,
  target,
  elapsedMs,
  activity,
) {
  function textUnits(text) {
    if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
      return Array.from(
        new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
      ).map((part) => part.segment);
    }
    return Array.from(text);
  }
  const typedUnits = textUnits(typed);
  const targetUnits = textUnits(target);
  let placedCorrect = 0;
  for (let index = 0; index < typedUnits.length; index += 1) {
    if (typedUnits[index] === targetUnits[index]) placedCorrect += 1;
  }

  const correct = activity?.correct ?? placedCorrect;
  const total = activity?.total ?? typedUnits.length;
  const incorrect = activity?.incorrect ?? Math.max(0, total - correct);
  const elapsedMinutes = Math.max(0, elapsedMs) / 60_000;
  const completedCharacters =
    activity?.completedCharacters ?? placedCorrect;

  return {
    correct,
    incorrect,
    total,
    wpm: elapsedMinutes > 0 ? correct / 5 / elapsedMinutes : 0,
    cpm: elapsedMinutes > 0 ? correct / elapsedMinutes : 0,
    accuracy: total > 0 ? (correct / total) * 100 : 0,
    completion:
      targetUnits.length > 0
        ? Math.min((completedCharacters / targetUnits.length) * 100, 100)
        : 0,
  };
}
