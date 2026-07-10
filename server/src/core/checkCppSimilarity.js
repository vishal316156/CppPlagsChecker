import { tokenizeCpp } from "../services/tokenizer.service.js";
import { normalizeTokens } from "../services/normalizer.service.js";
import { createNGrams } from "../services/ngram.service.js";
import {
  calculateJaccardSimilarity
} from "../services/similarity.service.js";
import {
  createWinnowingFingerprints
} from "../services/winnowing.service.js";

const SHORT_NGRAM_SIZE = 5;
const LONG_NGRAM_SIZE = 15;

const WINNOWING_K = 5;
const WINNOWING_WINDOW_SIZE = 4;

const DEFAULT_THRESHOLD = 0.20;

export function checkCppSimilarity(
  codeA,
  codeB,
  options = {}
) {
  if (typeof codeA !== "string" || typeof codeB !== "string") {
    throw new TypeError("Both C++ codes must be strings");
  }

  if (codeA.trim() === "" || codeB.trim() === "") {
    throw new Error("C++ codes cannot be empty");
  }

  const threshold =
    options.threshold ?? DEFAULT_THRESHOLD;

  if (
    typeof threshold !== "number" ||
    !Number.isFinite(threshold) ||
    threshold < 0 ||
    threshold > 1
  ) {
    throw new Error("Threshold must be between 0 and 1");
  }

  const normalizedA =
    normalizeTokens(tokenizeCpp(codeA));

  const normalizedB =
    normalizeTokens(tokenizeCpp(codeB));

  const shortA =
    createNGrams(normalizedA, SHORT_NGRAM_SIZE);

  const shortB =
    createNGrams(normalizedB, SHORT_NGRAM_SIZE);

  const longA =
    createNGrams(normalizedA, LONG_NGRAM_SIZE);

  const longB =
    createNGrams(normalizedB, LONG_NGRAM_SIZE);

  const shortScore =
    calculateJaccardSimilarity(shortA, shortB);

  const longScore =
    calculateJaccardSimilarity(longA, longB);

  const ngramScore =
    shortScore * 0.4 +
    longScore * 0.6;

  const fingerprintsA =
    createWinnowingFingerprints(
      normalizedA,
      WINNOWING_K,
      WINNOWING_WINDOW_SIZE
    );

  const fingerprintsB =
    createWinnowingFingerprints(
      normalizedB,
      WINNOWING_K,
      WINNOWING_WINDOW_SIZE
    );

  const winnowingScore =
    calculateJaccardSimilarity(
      fingerprintsA,
      fingerprintsB
    );

  return {
    flagged: winnowingScore >= threshold,

    similarityScore: winnowingScore,

    diagnostics: {
      ngramScore,
      shortScore,
      longScore,
      winnowingScore,
      threshold
    }
  };
}