export function createFrequencyMap(tokens) {
  if (!Array.isArray(tokens)) {
    throw new TypeError("Tokens must be an array");
  }

  const frequencyMap = new Map();

  for (const token of tokens) {
    frequencyMap.set(
      token,
      (frequencyMap.get(token) || 0) + 1
    );
  }
  return frequencyMap;
}

export function calculateCosineSimilarity(mapA, mapB) {
  if (!(mapA instanceof Map) || !(mapB instanceof Map)) {
    throw new TypeError("Both inputs must be Map objects");
  }

  if (mapA.size === 0 && mapB.size === 0) {
    return 1;
  }

  if (mapA.size === 0 || mapB.size === 0) {
    return 0;
  }

  const allTokens = new Set([
    ...mapA.keys(),
    ...mapB.keys()
  ]);

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const token of allTokens) {
    const countA = mapA.get(token) || 0;
    const countB = mapB.get(token) || 0;

    dotProduct += countA * countB;
    magnitudeA += countA * countA;
    magnitudeB += countB * countB;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return (
    dotProduct /
    (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB))
  );
}