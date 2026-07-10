import { describe, expect, test } from "vitest";

import {
  calculateJaccardSimilarity
} from "../src/services/similarity.service.js";

describe("Jaccard similarity", () => {
  test("identical sets return 1", () => {
    expect(
      calculateJaccardSimilarity(
        new Set(["a", "b"]),
        new Set(["a", "b"])
      )
    ).toBe(1);
  });

  test("disjoint sets return 0", () => {
    expect(
      calculateJaccardSimilarity(
        new Set(["a"]),
        new Set(["b"])
      )
    ).toBe(0);
  });

  test("partially overlapping sets return correct score", () => {
    expect(
      calculateJaccardSimilarity(
        new Set(["a", "b"]),
        new Set(["b", "c"])
      )
    ).toBeCloseTo(1 / 3);
  });

  test("two empty sets return 1", () => {
    expect(
      calculateJaccardSimilarity(
        new Set(),
        new Set()
      )
    ).toBe(1);
  });
});