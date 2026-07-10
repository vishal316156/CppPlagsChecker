import { describe, expect, test } from "vitest";

import {
  tokenizeCpp
} from "../src/services/tokenizer.service.js";

import {
  normalizeTokens
} from "../src/services/normalizer.service.js";

describe("token normalization", () => {
  test("variable renaming produces identical normalized output", () => {
    const codeA = `
      int sum = 0;
      sum++;
      return sum;
    `;

    const codeB = `
      int answer = 0;
      answer++;
      return answer;
    `;

    expect(
      normalizeTokens(tokenizeCpp(codeA))
    ).toEqual(
      normalizeTokens(tokenizeCpp(codeB))
    );
  });

  test("all identifiers normalize to the same token category", () => {
  const code = `
    int x = y + x;
  `;

  expect(
    normalizeTokens(tokenizeCpp(code))
  ).toEqual([
    "int",
    "IDENTIFIER",
    "=",
    "IDENTIFIER",
    "+",
    "IDENTIFIER",
    ";"
  ]);
});
});