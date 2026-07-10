export function evaluatePredictions(results) {
  let truePositive = 0;
  let falsePositive = 0;
  let trueNegative = 0;
  let falseNegative = 0;

  for (const result of results) {
    const expectedFlag = result.label === "SHOULD_FLAG";
    const predictedFlag = result.predictedFlag;

    if (expectedFlag && predictedFlag) {
      truePositive++;
    } else if (!expectedFlag && predictedFlag) {
      falsePositive++;
    } else if (!expectedFlag && !predictedFlag) {
      trueNegative++;
    } else {
      falseNegative++;
    }
  }

  const precision =
    truePositive + falsePositive === 0
      ? 0
      : truePositive / (truePositive + falsePositive);

  const recall =
    truePositive + falseNegative === 0
      ? 0
      : truePositive / (truePositive + falseNegative);

  const f1 =
    precision + recall === 0
      ? 0
      : (2 * precision * recall) / (precision + recall);

  return { truePositive,falsePositive,trueNegative,falseNegative,precision,recall,f1};
}