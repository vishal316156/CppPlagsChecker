import { describe, expect, test } from "vitest";

import {
  createFrequencyMap,
  calculateCosineSimilarity
} from "../src/services/frequency.service.js";

describe("token frequency similarity", () => {
  test("creates correct frequency map", () => {
    const tokens = [
      "int",
      "IDENTIFIER",
      "=",
      "NUMBER_LITERAL",
      ";",
      "IDENTIFIER",
      "++",
      ";"
    ];

    const map = createFrequencyMap(tokens);

    expect(map.get("IDENTIFIER")).toBe(2);
    expect(map.get(";")).toBe(2);
    expect(map.get("int")).toBe(1);
  });

  test("identical frequency maps return similarity 1", () => {
    const mapA = createFrequencyMap([
      "int",
      "IDENTIFIER",
      ";"
    ]);

    const mapB = createFrequencyMap([
      "int",
      "IDENTIFIER",
      ";"
    ]);

    expect(
      calculateCosineSimilarity(mapA, mapB)
    ).toBeCloseTo(1);
  });

  test("completely different frequency maps return 0", () => {
    const mapA = createFrequencyMap([
      "if",
      "if"
    ]);

    const mapB = createFrequencyMap([
      "while",
      "while"
    ]);

    expect(
      calculateCosineSimilarity(mapA, mapB)
    ).toBe(0);
  });

  test("token order does not affect frequency similarity", () => {
    const mapA = createFrequencyMap([
      "int",
      "IDENTIFIER",
      "=",
      "NUMBER_LITERAL"
    ]);

    const mapB = createFrequencyMap([
      "NUMBER_LITERAL",
      "=",
      "IDENTIFIER",
      "int"
    ]);

    expect(
      calculateCosineSimilarity(mapA, mapB)
    ).toBeCloseTo(1);
  });

  test("partially similar frequency maps return value between 0 and 1", () => {
    const mapA = createFrequencyMap([
      "int",
      "IDENTIFIER",
      "IDENTIFIER"
    ]);

    const mapB = createFrequencyMap([
      "int",
      "while",
      "while"
    ]);

    const score = calculateCosineSimilarity(mapA, mapB);

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });
});