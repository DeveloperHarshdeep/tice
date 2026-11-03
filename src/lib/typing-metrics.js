export function calculateTypingPerformance(
  typed,
  target,
  elapsedMs,
  activity,
) {
  let placedCorrect = 0;
  for (let index = 0; index < typed.length; index += 1) {
    if (typed[index] === target[index]) placedCorrect += 1;
  }

  const correct = activity?.correct ?? placedCorrect;
  const total = activity?.total ?? typed.length;
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
      target.length > 0 ? Math.min((completedCharacters / target.length) * 100, 100) : 0,
  };
}
